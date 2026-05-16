package com.example.PAI.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.PAI.dto.response.PreguntaQuizDTO;
import com.example.PAI.modelo.Quiz;
import com.example.PAI.repository.QuizRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    
    // Iniciar quiz → devuelve lista de preguntas
    public List<PreguntaQuizDTO> iniciarQuiz(String quizId) {
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);
        Quiz quiz = quizOpt.orElseThrow(() -> new RuntimeException("Quiz no encontrado"));

        // Convertir las preguntas a DTO (sin respuesta correcta)
        return quiz.getPreguntas().stream()
                .map(pregunta -> new PreguntaQuizDTO(
                        pregunta.getId(),
                        pregunta.getEnunciado(),
                        pregunta.getTipoPregunta()))
                .collect(Collectors.toList());
    }

    
}
