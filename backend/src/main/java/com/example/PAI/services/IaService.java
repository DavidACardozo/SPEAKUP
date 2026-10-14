package com.example.PAI.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Genera ejercicios "Gap Fill" con IA usando una API compatible con OpenAI (por defecto Groq).
 * La clave vive solo en el servidor (variable de entorno GROQ_API_KEY), nunca en el navegador.
 *
 * La IA solo escribe el párrafo y su traducción; los huecos los pone este servicio,
 * así el número de "___" siempre coincide con el de soluciones.
 */
@Slf4j
@Service
public class IaService {

    private static final int MAX_INTENTOS = 3;

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ia.url:https://api.groq.com/openai/v1/chat/completions}")
    private String iaUrl;

    @Value("${ia.key:}")
    private String iaKey;

    @Value("${ia.model:qwen/qwen3.8-27b}")
    private String iaModel;

    public IaService(@Value("${ia.timeout-segundos:60}") int timeoutSegundos) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10_000);
        factory.setReadTimeout(timeoutSegundos * 1000);
        this.restClient = RestClient.builder().requestFactory(factory).build();
    }

    public Map<String, Object> generarGapFill(String categoria, List<String> palabras) {
        if (iaKey == null || iaKey.isBlank()) {
            throw new IllegalStateException("GROQ_API_KEY no está configurada en el servidor");
        }

        IllegalStateException ultimoError = null;
        for (int intento = 1; intento <= MAX_INTENTOS; intento++) {
            try {
                return generarUnaVez(categoria, palabras);
            } catch (IllegalStateException e) {
                ultimoError = e;
                log.info("Gap Fill intento {}/{} descartado: {}", intento, MAX_INTENTOS, e.getMessage());
            }
        }
        throw ultimoError;
    }

    private Map<String, Object> generarUnaVez(String categoria, List<String> palabras) {
        String claves = String.join(", ", palabras);
        String prompt = """
                Act as an English teacher.
                Topic: %s.
                Keywords: %s.

                INSTRUCTIONS:
                1. Write a short paragraph (min 60 words) in English about the topic.
                2. Use EACH keyword at least once, written EXACTLY as given (same spelling, no plural or other forms).
                3. Do NOT hide or replace any word; write the full paragraph.
                4. Provide a full Spanish translation of the paragraph.

                STRICT JSON FORMAT:
                {
                  "parrafo": "The full English paragraph",
                  "traduccion": "Traducción completa al español"
                }""".formatted(categoria, claves);

        Map<String, Object> body = Map.of(
                "model", iaModel,
                "response_format", Map.of("type", "json_object"),
                "messages", List.of(
                        Map.of("role", "system", "content", "You are a helpful teacher. You ONLY respond with valid JSON code. No explanations."),
                        Map.of("role", "user", "content", prompt)
                ),
                "max_tokens", 1500,
                "temperature", 0.3
        );

        JsonNode respuesta;
        try {
            respuesta = restClient.post()
                    .uri(iaUrl)
                    .header("Authorization", "Bearer " + iaKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);
        } catch (Exception e) {
            throw new IllegalStateException("Error llamando a la IA: " + e.getMessage());
        }

        String contenido = respuesta.path("choices").path(0).path("message").path("content").asText("");
        int inicio = contenido.indexOf('{');
        int fin = contenido.lastIndexOf('}');
        if (inicio == -1 || fin <= inicio) {
            throw new IllegalStateException("La IA no devolvió JSON");
        }

        JsonNode datos;
        try {
            datos = objectMapper.readTree(contenido.substring(inicio, fin + 1));
        } catch (Exception e) {
            throw new IllegalStateException("JSON inválido de la IA: " + e.getMessage());
        }

        String parrafo = datos.path("parrafo").asText("");
        if (parrafo.isBlank()) {
            throw new IllegalStateException("La IA no devolvió el párrafo");
        }

        Map<String, Object> resultado = ocultarPalabras(parrafo, palabras);
        resultado.put("traduccion", datos.path("traduccion").asText(""));
        return resultado;
    }

    /** Reemplaza cada aparición de las palabras clave por "___" y guarda la solución de cada hueco en orden. */
    private Map<String, Object> ocultarPalabras(String parrafo, List<String> palabras) {
        String alternativas = String.join("|", palabras.stream().map(Pattern::quote).toList());
        Matcher matcher = Pattern.compile("\\b(" + alternativas + ")\\b", Pattern.CASE_INSENSITIVE).matcher(parrafo);

        StringBuilder texto = new StringBuilder();
        List<String> soluciones = new ArrayList<>();
        while (matcher.find()) {
            soluciones.add(matcher.group(1));
            matcher.appendReplacement(texto, "___");
        }
        matcher.appendTail(texto);

        for (String palabra : palabras) {
            boolean usada = soluciones.stream().anyMatch(s -> s.equalsIgnoreCase(palabra));
            if (!usada) {
                throw new IllegalStateException("La IA no usó la palabra '" + palabra + "'");
            }
        }

        Map<String, Object> resultado = new LinkedHashMap<>();
        resultado.put("texto", texto.toString());
        resultado.put("soluciones", soluciones);
        return resultado;
    }
}
