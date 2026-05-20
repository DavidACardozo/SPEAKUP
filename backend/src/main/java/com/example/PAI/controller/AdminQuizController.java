package com.example.PAI.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PAI.repository.QuizRepository;
import com.example.PAI.services.AdminService; // 🔥 NUEVO

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/quizzes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminQuizController {

    private final QuizRepository quizRepository;
    private final AdminService adminService;

    // 🔥 NUEVO → LISTAR QUIZZES
@GetMapping
public ResponseEntity<?> listarQuizzes() {
    return ResponseEntity.ok(adminService.listarQuizzes());
}
    // 🔥 NUEVO → ELIMINAR QUIZ
@DeleteMapping("/{id}")
public ResponseEntity<?> eliminarQuiz(@PathVariable String id) {
    try {
        return ResponseEntity.ok(adminService.eliminarQuiz(id));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
}