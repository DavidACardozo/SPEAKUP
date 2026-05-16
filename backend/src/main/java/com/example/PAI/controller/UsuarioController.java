package com.example.PAI.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.PAI.dto.response.CategoriaDesbloqueadaResponseDTO;
import com.example.PAI.dto.response.HistorialQuizDTO;
import com.example.PAI.services.UsuarioCategoriaService;
import com.example.PAI.services.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final UsuarioCategoriaService usuarioCategoriaService;

    // Actualizar perfil
    @PutMapping("/{usuarioId}/perfil")
    public ResponseEntity<String> actualizarPerfil(
            @PathVariable String usuarioId,
            @RequestBody Map<String, String> body) {

        try {
            String nuevoEmail = body.get("nuevoEmail");
            String nuevaPassword = body.get("nuevaPassword");
            String passwordActual = body.get("passwordActual");

            String resultado = usuarioService.actualizarPerfil(usuarioId, nuevoEmail, nuevaPassword, passwordActual);
            return ResponseEntity.ok(resultado);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Categorías desbloqueadas
    @GetMapping("/{usuarioId}/categorias-desbloqueadas")
    public ResponseEntity<List<CategoriaDesbloqueadaResponseDTO>> getCategoriasDesbloqueadas(
            @PathVariable String usuarioId) {
        try {
            return ResponseEntity.ok(usuarioCategoriaService.listarCategoriasDesbloqueadas(usuarioId));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Historial
    @GetMapping("/{usuarioId}/historial")
    public ResponseEntity<List<HistorialQuizDTO>> getHistorialPorCategoria(
            @PathVariable String usuarioId,
            @RequestParam String categoriaId) {
        try {
            List<HistorialQuizDTO> historial = usuarioService.verHistorialPorCategoria(usuarioId, categoriaId);
            return ResponseEntity.ok(historial);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}