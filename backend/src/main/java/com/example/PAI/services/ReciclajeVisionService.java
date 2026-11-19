package com.example.PAI.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class ReciclajeVisionService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${reciclaje.vision.provider:groq}")
    private String provider;

    @Value("${reciclaje.vision.api-url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    @Value("${reciclaje.vision.api-key:${RECICLAJE_VISION_API_KEY:${GROQ_API_KEY:${HF_TOKEN:}}}}")
    private String apiKey;

    @Value("${reciclaje.vision.model:qwen/qwen3.8-27b}")
    private String model;

    public ReciclajeVisionService(@Value("${reciclaje.vision.timeout-segundos:60}") int timeoutSegundos) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10_000);
        factory.setReadTimeout(timeoutSegundos * 1000);
        this.restClient = RestClient.builder().requestFactory(factory).build();
    }

    public Map<String, Object> clasificarImagen(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Debes adjuntar una foto.");
        }
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("La foto debe pesar menos de 10 MB.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Selecciona un archivo de imagen válido.");
        }
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("El análisis de fotos no está configurado. Define GROQ_API_KEY en el archivo .env.");
        }

        try {
            return "huggingface".equalsIgnoreCase(provider.trim())
                    ? clasificarConHuggingFace(file)
                    : clasificarConVision(file);
        } catch (Exception e) {
            log.warn("Fallo en visión de reciclaje: {}", e.getMessage());
            throw new IllegalStateException("No pudimos clasificar la imagen. Intenta con otra foto.", e);
        }
    }

    private Map<String, Object> clasificarConHuggingFace(MultipartFile file) throws Exception {
        JsonNode response = restClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.parseMediaType(file.getContentType()))
                .accept(MediaType.APPLICATION_JSON)
                .body(file.getBytes())
                .retrieve()
                .body(JsonNode.class);

        if (response == null) {
            throw new IllegalStateException("Hugging Face no devolvió una respuesta");
        }
        if (response.has("error") && !response.path("error").asText("").isBlank()) {
            throw new IllegalStateException("Hugging Face: " + response.path("error").asText());
        }
        if (!response.isArray() || response.isEmpty()) {
            throw new IllegalStateException("Hugging Face no pudo identificar la imagen");
        }

        String label = response.get(0).path("label").asText("").toLowerCase();
        double confidence = response.get(0).path("score").asDouble(0.6);
        String material = mapHuggingFaceLabel(label);

        Map<String, Object> result = new HashMap<>();
        result.put("material", material);
        result.put("label", toLabel(material));
        result.put("caneca", getCaneca(material));
        result.put("recomendacion", getRecomendacion(material));
        result.put("confidence", Math.max(0.1, Math.min(0.99, confidence)));
        result.put("mensaje", "Parece un material: " + toLabel(material));
        result.put("source", "huggingface");
        result.put("providerLabel", label);
        result.put("nota", "Es una sugerencia, no una identificación exacta del objeto.");
        return result;
    }

    private String mapHuggingFaceLabel(String label) {
        String normalized = label.toLowerCase()
                .replace("_", " ").replace("-", " ");
        if (normalized.contains("aluminium") || normalized.contains("aluminum")
                || normalized.contains("metal") || normalized.contains("can")) return "metal";
        if (normalized.contains("glass") || normalized.contains("bottle")) return "vidrio";
        if (normalized.contains("cardboard") || normalized.contains("paper")
                || normalized.contains("carton") || normalized.contains("towel")) return "papel";
        if (normalized.contains("plastic") || normalized.contains("polystyrene")
                || normalized.contains("takeaway cup") || normalized.contains("disposable plate")
                || normalized.contains("packaging")) return "plastico";
        if (normalized.contains("organic") || normalized.contains("food")
                || normalized.contains("fruit") || normalized.contains("vegetable")) return "organico";
        return "no_aprovechable";
    }

    private Map<String, Object> clasificarConVision(MultipartFile file) throws Exception {
        byte[] content = file.getBytes();
        String base64 = java.util.Base64.getEncoder().encodeToString(content);

        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("temperature", 0.1);
        body.put("max_completion_tokens", 900);
        body.put("response_format", Map.of("type", "json_object"));
        body.put("messages", List.of(
                Map.of("role", "system", "content", "Analizas fotos de residuos para orientar su separación en Colombia. Describe solo objetos visibles, no inventes. Estima el material cuando no se pueda confirmar y expresa la incertidumbre en confidence. Responde únicamente JSON válido."),
                Map.of("role", "user", "content", List.of(
                        Map.of("type", "text", "text", "Analiza la foto y detecta cada tipo de residuo visible (máximo 10). Devuelve JSON con summary y items. Cada item debe tener objeto (nombre breve), material (plastico, vidrio, papel, metal, organico o no_aprovechable), confidence (0 a 1) y cantidad (entero estimado, mínimo 1). Agrupa objetos iguales en una sola entrada y estima su cantidad. No afirmes composición exacta si no es visible. Si no hay residuos identificables, devuelve items vacío y explica en summary. No incluyas instrucciones de reciclaje; las agregará la aplicación."),
                        Map.of("type", "image_url", "image_url", Map.of("url", "data:" + file.getContentType() + ";base64," + base64))
                ))
        ));

        JsonNode response = restClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(JsonNode.class);

        JsonNode choices = response.path("choices");
        String text = null;
        if (choices.isArray() && !choices.isEmpty()) {
            text = extractText(choices.get(0).path("message").path("content"));
        }
        if (text == null || text.isBlank()) {
            throw new IllegalStateException("La IA no devolvió una respuesta válida");
        }

        return parseVisionResponse(text);
    }

    private String extractText(JsonNode node) {
        if (node == null || node.isNull()) return null;
        if (node.isTextual()) return node.asText();
        if (node.isArray()) {
            for (JsonNode item : node) {
                String text = extractText(item);
                if (text != null && !text.isBlank()) return text;
            }
        }
        if (node.isObject()) {
            for (String key : List.of("content", "text", "output_text", "message", "value")) {
                JsonNode value = node.get(key);
                if (value != null) {
                    String text = extractText(value);
                    if (text != null && !text.isBlank()) return text;
                }
            }
        }
        return null;
    }

    private Map<String, Object> parseVisionResponse(String text) throws Exception {
        String json = text;
        int start = json.indexOf('{');
        int end = json.lastIndexOf('}');
        if (start >= 0 && end > start) {
            json = json.substring(start, end + 1);
        }

        JsonNode node = objectMapper.readTree(json);
        JsonNode detectedItems = node.path("items");
        if (detectedItems.isArray()) {
            List<Map<String, Object>> items = new java.util.ArrayList<>();
            for (JsonNode detected : detectedItems) {
                String itemMaterial = normalizeMaterial(detected.path("material").asText("no_aprovechable"));
                double itemConfidence = detected.path("confidence").asDouble(0.5);
                Map<String, Object> item = new HashMap<>();
                item.put("objeto", detected.path("objeto").asText("Residuo visible"));
                item.put("cantidad", Math.max(1, detected.path("cantidad").asInt(1)));
                item.put("material", itemMaterial);
                item.put("label", toLabel(itemMaterial));
                item.put("caneca", getCaneca(itemMaterial));
                item.put("recomendacion", getRecomendacion(itemMaterial));
                item.put("confidence", Math.max(0.0, Math.min(1.0, itemConfidence)));
                items.add(item);
            }

            Map<String, Object> result = new HashMap<>();
            result.put("items", items);
            result.put("materiales", items.stream().map(item -> item.get("material")).distinct().toList());
            result.put("material", items.isEmpty() ? "no_aprovechable" : items.get(0).get("material"));
            result.put("label", items.isEmpty() ? "Sin residuos identificables" : items.get(0).get("label"));
            result.put("caneca", items.isEmpty() ? "" : items.get(0).get("caneca"));
            result.put("recomendacion", items.isEmpty() ? "Prueba con una foto más cercana y bien iluminada." : items.get(0).get("recomendacion"));
            result.put("confidence", items.isEmpty() ? 0.0 : items.get(0).get("confidence"));
            result.put("mensaje", node.path("summary").asText(items.isEmpty() ? "No identificamos residuos con claridad." : "Estimamos " + items.size() + " tipo(s) de residuo en la foto."));
            result.put("source", "vision-api");
            result.put("nota", "Materiales y cantidades estimados a partir de lo visible; verifica antes de separarlos.");
            return result;
        }

        String material = normalizeMaterial(node.path("material").asText("papel"));
        String caneca = node.path("caneca").asText(getCaneca(material));
        String recomendacion = node.path("recomendacion").asText(getRecomendacion(material));
        String mensaje = node.path("mensaje").asText("Parece un material: " + toLabel(material));
        double confidence = node.path("confidence").asDouble(0.6);

        Map<String, Object> result = new HashMap<>();
        result.put("material", material);
        result.put("label", toLabel(material));
        result.put("caneca", caneca);
        result.put("recomendacion", recomendacion);
        result.put("confidence", Math.max(0.1, Math.min(0.99, confidence)));
        result.put("mensaje", mensaje);
        result.put("source", "vision-api");
        result.put("nota", "Es una sugerencia, no una identificación exacta del objeto.");
        return result;
    }

    private Map<String, Object> clasificacionMock(MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        result.put("material", "papel");
        result.put("label", "Papel y cartón");
        result.put("caneca", "Blanca");
        result.put("recomendacion", "Seco y sin restos de comida.");
        result.put("confidence", 0.62);
        result.put("mensaje", "Parece un material: Papel y cartón");
        result.put("source", "mock");
        result.put("nota", "Es una sugerencia, no una identificación exacta del objeto.");
        return result;
    }

    private String normalizeMaterial(String material) {
        if (material == null) return "papel";
        String normalized = material.trim().toLowerCase().replace("á", "a").replace("é", "e").replace("í", "i").replace("ó", "o").replace("ú", "u").replace(" ", "_");
        return switch (normalized) {
            case "plastic", "plastico", "plasticos" -> "plastico";
            case "glass", "vidrio", "vidrios" -> "vidrio";
            case "paper", "paperboard", "carton", "papel", "papel_y_carton", "papel_carton" -> "papel";
            case "metal", "metales", "aluminio" -> "metal";
            case "organic", "organico", "organicos", "organica" -> "organico";
            case "no_aprovechable", "non_recyclable", "trash", "basura" -> "no_aprovechable";
            default -> "no_aprovechable";
        };
    }

    private String getCaneca(String material) {
        return switch (material) {
            case "plastico" -> "Blanca";
            case "vidrio" -> "Blanca";
            case "papel" -> "Blanca";
            case "metal" -> "Blanca";
            case "organico" -> "Verde";
            case "no_aprovechable" -> "Negra";
            default -> "Blanca";
        };
    }

    private String getRecomendacion(String material) {
        return switch (material) {
            case "plastico" -> "Limpio y seco. Aplasta botellas y envases.";
            case "vidrio" -> "Enjuágalo. Envuelve lo roto para evitar cortes.";
            case "papel" -> "Seco y sin restos de comida.";
            case "metal" -> "Enjuaga y aplasta las latas.";
            case "organico" -> "Cáscaras, frutas, verduras y restos de comida cruda.";
            case "no_aprovechable" -> "Papel higiénico, servilletas usadas, comida preparada.";
            default -> "Limpio y seco.";
        };
    }

    private String toLabel(String material) {
        return switch (material) {
            case "plastico" -> "Plástico";
            case "vidrio" -> "Vidrio";
            case "papel" -> "Papel y cartón";
            case "metal" -> "Metal";
            case "organico" -> "Orgánico";
            case "no_aprovechable" -> "No aprovechable";
            default -> "Papel y cartón";
        };
    }
}
