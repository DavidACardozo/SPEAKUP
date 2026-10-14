package com.example.PAI.controller;

import com.example.PAI.services.IaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/ia")
@RequiredArgsConstructor
public class IaController {

    private final IaService iaService;

    @PostMapping("/gap-fill")
    public ResponseEntity<?> generarGapFill(@RequestBody Map<String, Object> request) {
        String categoria = String.valueOf(request.getOrDefault("categoria", ""));
        Object palabrasRaw = request.get("palabras");
        List<String> palabras = palabrasRaw instanceof List<?> lista
                ? lista.stream().map(String::valueOf).toList()
                : List.of();

        if (palabras.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "Debes enviar al menos una palabra"));
        }

        try {
            return ResponseEntity.ok(iaService.generarGapFill(categoria, palabras));
        } catch (Exception e) {
            log.warn("Falla IA gap-fill: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("mensaje", "La IA no está disponible en este momento"));
        }
    }
}
