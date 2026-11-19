package com.example.PAI.controller;

import com.example.PAI.services.ReciclajeVisionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/reciclaje")
@RequiredArgsConstructor
public class ReciclajeVisionController {

    private final ReciclajeVisionService reciclajeVisionService;

    @PostMapping("/classify")
    public ResponseEntity<Map<String, Object>> clasificarImagen(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Debes adjuntar una foto.",
                    "material", "papel",
                    "source", "mock"
            ));
        }

        try {
            return ResponseEntity.ok(reciclajeVisionService.clasificarImagen(file));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            log.warn("Servicio de visión no disponible: {}", e.getMessage());
            return ResponseEntity.status(503).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.warn("Error clasificando imagen de reciclaje: {}", e.getMessage());
            return ResponseEntity.status(502).body(Map.of("error", "No pudimos clasificar la imagen. Intenta con otra foto."));
        }
    }
}
