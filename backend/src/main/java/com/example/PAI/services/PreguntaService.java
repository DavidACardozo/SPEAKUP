package com.example.PAI.services;

import org.springframework.stereotype.Service;

import com.example.PAI.modelo.Pregunta;
import com.example.PAI.modelo.Quiz;
import com.example.PAI.repository.QuizRepository;

import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PreguntaService {

    private final QuizRepository quizRepository; // ← reemplaza PreguntaRepository

    public boolean validarRespuesta(String preguntaId, String respuestaUsuario) {

        // Buscar la pregunta dentro de todos los quizzes
        Pregunta pregunta = quizRepository.findAll().stream()
                .map(Quiz::getPreguntas)
                .flatMap(List::stream)
                .filter(p -> preguntaId.equals(p.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Pregunta no encontrada: " + preguntaId));

        if (respuestaUsuario == null || respuestaUsuario.isBlank())
            return false;

        String correcta = pregunta.getRespuesta()
                .trim()
                .toLowerCase();

        String usuario = respuestaUsuario
                .trim()
                .toLowerCase();

        return correcta.equals(usuario);
    }
}