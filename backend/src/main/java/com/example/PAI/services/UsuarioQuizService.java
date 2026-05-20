package com.example.PAI.services;

import java.util.Date;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.PAI.dto.request.FinalizarQuizRequestDTO;
import com.example.PAI.dto.request.RespuestaUsuarioDTO;
import com.example.PAI.dto.response.ResultadoQuizResponseDTO;
import com.example.PAI.modelo.*;
import com.example.PAI.repository.CategoriaRepository;
import com.example.PAI.repository.QuizRepository;
import com.example.PAI.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioQuizService {

    private static final double PUNTAJE_DESBLOQUEO_CATEGORIA = 90.0;

    private final UsuarioRepository usuarioRepository;
    private final QuizRepository quizRepository;
    private final CategoriaRepository categoriaRepository;
    private final PreguntaService preguntaService;
    private final UsuarioCategoriaService usuarioCategoriaService;

    public ResultadoQuizResponseDTO finalizarQuizYRegistrarIntento(String usuarioId, FinalizarQuizRequestDTO request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz no encontrado"));

        int totalPreguntas = quiz.getPreguntas().size();
        int correctas = calcularCorrectas(request, quiz);
        double puntaje = ((double) correctas / totalPreguntas) * 100;

        registrarIntento(usuario, quiz, puntaje);

        boolean categoriaDesbloqueada = desbloquearSiguienteCategoriaSiAplica(usuario, quiz, puntaje);

        String mensaje = categoriaDesbloqueada
                ? "¡Felicidades! Has desbloqueado una nueva categoría."
                : "Quiz completado. Sigue practicando para desbloquear más categorías.";

        return new ResultadoQuizResponseDTO(puntaje, totalPreguntas, correctas, categoriaDesbloqueada, mensaje);
    }

    private int calcularCorrectas(FinalizarQuizRequestDTO request, Quiz quiz) {
        int correctas = 0;
        for (Pregunta pregunta : quiz.getPreguntas()) {
            RespuestaUsuarioDTO respuestaDTO = request.getRespuestas().stream()
                    .filter(r -> r.getPreguntaId().equals(pregunta.getId()))
                    .findFirst()
                    .orElse(null);

            if (respuestaDTO != null && preguntaService.validarRespuesta(pregunta.getId(), respuestaDTO.getRespuestaUsuario())) {
                correctas++;
            }
        }
        return correctas;
    }

    private void registrarIntento(Usuario usuario, Quiz quiz, double puntaje) {
        // Contar intentos previos desde la lista embebida del usuario
        long intentosPrevios = usuario.getIntentos().stream()
                .filter(i -> i.getQuizId() != null && i.getQuizId().equals(quiz.getId()))
                .count();

        // Crear el intento embebido
        UsuarioQuiz intento = new UsuarioQuiz();
        intento.setQuizId(quiz.getId());
        intento.setQuizTitulo(quiz.getTitulo());
        intento.setFechaRealizacion(new Date());
        intento.setIntentos((int) intentosPrevios + 1);
        intento.setPuntaje(puntaje);

        // Agregar a la lista embebida del usuario y guardar
        usuario.getIntentos().add(intento);
        usuarioRepository.save(usuario);
    }

    private boolean desbloquearSiguienteCategoriaSiAplica(Usuario usuario, Quiz quiz, double puntaje) {
        if (puntaje <= PUNTAJE_DESBLOQUEO_CATEGORIA) {
            return false;
        }

        Optional<Categoria> categoriaActualOpt = categoriaRepository.findByQuizId(quiz.getId());
        if (categoriaActualOpt.isEmpty()) {
            return false;
        }

        Categoria categoriaActual = categoriaActualOpt.get();
        if (categoriaActual.getQuizIds() == null || categoriaActual.getQuizIds().isEmpty()) {
            return false;
        }

        String quizFinalId = categoriaActual.getQuizIds().get(categoriaActual.getQuizIds().size() - 1);
        if (!quizFinalId.equals(quiz.getId())) {
            return false;
        }

        int nivelSiguiente = categoriaActual.getNivel() + 1;
        Optional<Categoria> siguienteOpt = categoriaRepository.findByNivel(nivelSiguiente);
        if (siguienteOpt.isPresent()) {
            Categoria siguiente = siguienteOpt.get();

            boolean yaDesbloqueada = usuario.getCategorias().stream()
                    .filter(uc -> uc.getCategoriaId().equals(siguiente.getId()))
                    .findFirst()
                    .map(UsuarioCategoria::isDesbloqueada)
                    .orElse(false);

            if (!yaDesbloqueada) {
                usuarioCategoriaService.desbloquearCategoria(usuario, siguiente);
                return true;
            }
        }
        return false;
    }
}
