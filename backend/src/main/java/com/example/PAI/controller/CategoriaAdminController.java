package com.example.PAI.controller;



import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.PAI.dto.request.CrearCategoriaDTO;
import com.example.PAI.dto.response.CategoriaCompletaDTO;
import com.example.PAI.services.CategoriaService;
import java.util.Map;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/categorias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoriaAdminController {

    private final CategoriaService categoriaService;

    
    /**
     * CREAR NUEVA CATEGORÍA
     * POST /api/admin/categorias
     */
    @PostMapping
    public ResponseEntity<?> crearCategoria(@RequestBody CrearCategoriaDTO request) {
        try {
            CategoriaCompletaDTO nuevaCategoria = categoriaService.crearCategoria(request);
            return ResponseEntity.ok(nuevaCategoria);
        } catch (Exception e) {
            // Devolvemos un mapa con el mensaje de error para que sea fácil de leer en el frontend
            return ResponseEntity.badRequest().body(Map.of(
                "mensaje", "Error al crear la categoría",
                "error", e.getMessage()
            ));
        }
    }
}