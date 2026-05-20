package com.example.PAI.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PAI.dto.request.CrearCategoriaDTO;
import com.example.PAI.dto.response.CategoriaCompletaDTO;
import com.example.PAI.modelo.Categoria;
import com.example.PAI.repository.CategoriaRepository;
import com.example.PAI.repository.QuizRepository;
import com.example.PAI.services.CategoriaService;
import com.example.PAI.services.AdminService; // 🔥 NUEVO

import lombok.RequiredArgsConstructor;


import java.util.Map;

@RestController
@RequestMapping("/api/admin/categorias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoriaAdminController {

    private final CategoriaService categoriaService;
    private final AdminService adminService; // 🔥 NUEVO
    
    // 🔥 NUEVO
    private final CategoriaRepository categoriaRepository;
    private final QuizRepository quizRepository;

    

    // ✅ YA EXISTÍA
    @PostMapping
    public ResponseEntity<?> crearCategoria(@RequestBody CrearCategoriaDTO request) {
        try {
            CategoriaCompletaDTO nuevaCategoria = categoriaService.crearCategoria(request);
            return ResponseEntity.ok(nuevaCategoria);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "mensaje", "Error al crear la categoría",
                "error", e.getMessage()
            ));
        }
    }

    // 🔥 NUEVO → LISTAR TODAS LAS CATEGORÍAS
@GetMapping
public ResponseEntity<?> listarCategorias() {
    return ResponseEntity.ok(adminService.listarCategorias());
}

    // 🔥 NUEVO → ELIMINAR CATEGORÍA + QUIZ
@DeleteMapping("/{id}")
public ResponseEntity<?> eliminarCategoria(@PathVariable String id) {
    try {
        return ResponseEntity.ok(adminService.eliminarCategoria(id));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

// 🔥 ACTUALIZAR CATEGORÍA + VOCABULARIO + QUIZZES
@PutMapping("/{id}")
public ResponseEntity<?> actualizarCategoria(
        @PathVariable String id,
        @RequestBody CrearCategoriaDTO request) {

    try {

        CategoriaCompletaDTO categoriaActualizada =
                categoriaService.actualizarCategoriaCompleta(id, request);

        return ResponseEntity.ok(categoriaActualizada);

    } catch (Exception e) {

        return ResponseEntity.badRequest().body(
                Map.of(
                        "mensaje", "Error actualizando categoría",
                        "error", e.getMessage()
                )
        );
    }
}
}