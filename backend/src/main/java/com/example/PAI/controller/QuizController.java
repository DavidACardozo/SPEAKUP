package com.example.PAI.controller;

import com.example.PAI.dto.request.FinalizarQuizRequestDTO;
import com.example.PAI.dto.response.PreguntaQuizDTO;
import com.example.PAI.dto.response.ResultadoQuizResponseDTO;
import com.example.PAI.modelo.Usuario;
import com.example.PAI.services.QuizService;
import com.example.PAI.services.UsuarioQuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuizController {

    private final QuizService quizService;
    private final UsuarioQuizService usuarioQuizService;

    @GetMapping("/{quizId}/iniciar")
    public ResponseEntity<?> iniciarQuiz(@PathVariable String quizId) {
        try {
            List<PreguntaQuizDTO> preguntas = quizService.iniciarQuiz(quizId);
            return ResponseEntity.ok(preguntas);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", e.getMessage()));
        }
    }

    @PostMapping("/finalizar")
    public ResponseEntity<ResultadoQuizResponseDTO> finalizarQuiz(
            @RequestBody FinalizarQuizRequestDTO request,
            @AuthenticationPrincipal UserDetails userDetails) { // ← UserDetails en lugar de Usuario

        try {
            // Verificar que el usuario está autenticado
            if (userDetails == null) {
                return ResponseEntity.status(401).body(
                    new ResultadoQuizResponseDTO(0, 0, 0, false, "Usuario no autenticado")
                );
            }

            // Castear a Usuario ya que implementa UserDetails
            Usuario usuarioLogueado = (Usuario) userDetails;
            String usuarioId = usuarioLogueado.getId();

            ResultadoQuizResponseDTO resultado = usuarioQuizService
                .finalizarQuizYRegistrarIntento(usuarioId, request);
            return ResponseEntity.ok(resultado);

        } catch (ClassCastException e) {
            return ResponseEntity.status(403).body(
                new ResultadoQuizResponseDTO(0, 0, 0, false, "Error de autenticación: " + e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new ResultadoQuizResponseDTO(0, 0, 0, false, "Error al procesar el quiz: " + e.getMessage())
            );
        }
    }
}
