package com.example.PAI.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PAI.dto.request.CrearCategoriaDTO;
import com.example.PAI.dto.response.CategoriaCompletaDTO;
import com.example.PAI.dto.response.VocabularioDTO;
import com.example.PAI.dto.response.VocabularioInfoDTO;
import com.example.PAI.modelo.Categoria;
import com.example.PAI.modelo.Pregunta;
import com.example.PAI.modelo.Quiz;
import com.example.PAI.modelo.Vocabulario;
import com.example.PAI.repository.CategoriaRepository;
import com.example.PAI.repository.QuizRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final QuizRepository quizRepository;

    // =========================================================
// 🔥 CREAR CATEGORÍA CON 3 QUIZZES DIVIDIDOS
// =========================================================
    @Transactional
    public CategoriaCompletaDTO crearCategoria(CrearCategoriaDTO request) {

        // =========================================
        // NIVEL AUTOMÁTICO
        // =========================================
        int nuevoNivel = categoriaRepository.findFirstByOrderByNivelDesc()
                .map(Categoria::getNivel)
                .orElse(0) + 1;

        // =========================================
        // CREAR CATEGORÍA
        // =========================================
        Categoria categoria = new Categoria();

        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());
        categoria.setNivel(nuevoNivel);

        categoria.setVocabularios(new ArrayList<>());

        // =========================================
        // GUARDAR VOCABULARIOS
        // =========================================
        if (request.getVocabularios() != null) {

            for (VocabularioDTO vReq : request.getVocabularios()) {

                Vocabulario v = new Vocabulario();

                v.setId(UUID.randomUUID().toString());

                v.setPalabraIngles(vReq.getPalabraIngles());

                v.setPalabraEspanol(vReq.getPalabraEspanol());

                v.setPronunciacion(vReq.getPronunciacion());

                categoria.getVocabularios().add(v);
            }
        }

        // =========================================
        // GUARDAR CATEGORÍA PRIMERO
        // =========================================
        categoria = categoriaRepository.save(categoria);

        // =========================================
        // 🔥 CREAR QUIZZES DIVIDIDOS
        // =========================================
        List<String> quizIds = new ArrayList<>();

        List<Vocabulario> vocabularios = categoria.getVocabularios();

        // dividir vocabularios
        int mitad = vocabularios.size() / 2;

        List<Vocabulario> primeraParte
                = vocabularios.subList(0, mitad);

        List<Vocabulario> segundaParte
                = vocabularios.subList(mitad, vocabularios.size());

        // =====================================================
        // 🔥 QUIZ 1
        // =====================================================
        Quiz quiz1 = new Quiz();

        quiz1.setId(UUID.randomUUID().toString());

        quiz1.setTitulo("Quiz 1 de " + categoria.getNombre());

        quiz1.setDescripcion("Primera parte");

        quiz1.setCategoriaId(categoria.getId());

        quiz1.setPreguntas(new ArrayList<>());

        for (Vocabulario v : primeraParte) {

            Pregunta p = new Pregunta();

            p.setId(UUID.randomUUID().toString());

            p.setEnunciado(
                    "¿Cómo se dice '"
                    + v.getPalabraEspanol()
                    + "' en inglés?"
            );

            p.setRespuesta(v.getPalabraIngles());

            p.setTipoPregunta("ESP_A_ING");

            quiz1.getPreguntas().add(p);
        }

        quiz1 = quizRepository.save(quiz1);

        quizIds.add(quiz1.getId());

        // =====================================================
        // 🔥 QUIZ 2
        // =====================================================
        Quiz quiz2 = new Quiz();

        quiz2.setId(UUID.randomUUID().toString());

        quiz2.setTitulo("Quiz 2 de " + categoria.getNombre());

        quiz2.setDescripcion("Segunda parte");

        quiz2.setCategoriaId(categoria.getId());

        quiz2.setPreguntas(new ArrayList<>());

        for (Vocabulario v : segundaParte) {

            Pregunta p = new Pregunta();

            p.setId(UUID.randomUUID().toString());

            p.setEnunciado(
                    "¿Cómo se dice '"
                    + v.getPalabraEspanol()
                    + "' en inglés?"
            );

            p.setRespuesta(v.getPalabraIngles());

            p.setTipoPregunta("ESP_A_ING");

            quiz2.getPreguntas().add(p);
        }

        quiz2 = quizRepository.save(quiz2);

        quizIds.add(quiz2.getId());

        // =====================================================
        // 🔥 QUIZ FINAL
        // =====================================================
        Quiz quiz3 = new Quiz();

        quiz3.setId(UUID.randomUUID().toString());

        quiz3.setTitulo("Quiz Final de " + categoria.getNombre());

        quiz3.setDescripcion("Quiz final acumulativo");

        quiz3.setCategoriaId(categoria.getId());

        quiz3.setPreguntas(new ArrayList<>());

        // agregar preguntas del quiz 1
        quiz3.getPreguntas().addAll(quiz1.getPreguntas());

        // agregar preguntas del quiz 2
        quiz3.getPreguntas().addAll(quiz2.getPreguntas());

        quiz3 = quizRepository.save(quiz3);

        quizIds.add(quiz3.getId());

        // =========================================
        // GUARDAR IDS DE QUIZZES
        // =========================================
        categoria.setQuizIds(quizIds);

        categoria = categoriaRepository.save(categoria);

        return convertirACategoriaCompletaDTO(categoria);
    }
    // =====================================================
// 🔥 ACTUALIZAR CATEGORÍA COMPLETA
// =====================================================

    @Transactional
    public CategoriaCompletaDTO actualizarCategoriaCompleta(
            String categoriaId,
            CrearCategoriaDTO request) {

        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        // =========================================
        // ACTUALIZAR DATOS
        // =========================================
        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());

        // =========================================
        // LIMPIAR VOCABULARIOS
        // =========================================
        categoria.getVocabularios().clear();

        // =========================================
        // CREAR NUEVOS VOCABULARIOS
        // =========================================
        if (request.getVocabularios() != null) {

            for (VocabularioDTO vReq : request.getVocabularios()) {

                Vocabulario v = new Vocabulario();

                v.setId(UUID.randomUUID().toString());

                v.setPalabraIngles(vReq.getPalabraIngles());

                v.setPalabraEspanol(vReq.getPalabraEspanol());

                v.setPronunciacion(vReq.getPronunciacion());

                categoria.getVocabularios().add(v);
            }
        }

        // =========================================
        // ELIMINAR QUIZZES VIEJOS
        // =========================================
        if (categoria.getQuizIds() != null) {

            for (String quizId : categoria.getQuizIds()) {

                quizRepository.deleteById(quizId);
            }
        }

        // =========================================
        // LIMPIAR IDS
        // =========================================
        categoria.setQuizIds(new ArrayList<>());

        // =========================================
        // 🔥 DIVIDIR VOCABULARIOS EN 2 MITADES
        // =========================================
        List<Vocabulario> vocabularios = categoria.getVocabularios();

        int mitad = (int) Math.ceil(vocabularios.size() / 2.0);

        List<Vocabulario> primeraMitad
                = vocabularios.subList(0, mitad);

        List<Vocabulario> segundaMitad
                = vocabularios.subList(mitad, vocabularios.size());

        // =========================================
        // 🔥 QUIZ 1 → PRIMERA MITAD
        // =========================================
        Quiz quiz1 = new Quiz();

        quiz1.setId(UUID.randomUUID().toString());

        quiz1.setTitulo("Quiz 1 de " + categoria.getNombre());

        quiz1.setDescripcion("Primera parte del vocabulario");

        quiz1.setCategoriaId(categoria.getId());

        quiz1.setPreguntas(new ArrayList<>());

        for (Vocabulario v : primeraMitad) {

            Pregunta p = new Pregunta();

            p.setId(UUID.randomUUID().toString());

            p.setEnunciado(
                    "¿Cómo se dice '"
                    + v.getPalabraEspanol()
                    + "' en inglés?"
            );

            p.setRespuesta(v.getPalabraIngles());

            p.setTipoPregunta("ESP_A_ING");

            quiz1.getPreguntas().add(p);
        }

        Quiz quiz1Guardado = quizRepository.save(quiz1);

        categoria.getQuizIds().add(quiz1Guardado.getId());

        // =========================================
        // 🔥 QUIZ 2 → SEGUNDA MITAD
        // =========================================
        Quiz quiz2 = new Quiz();

        quiz2.setId(UUID.randomUUID().toString());

        quiz2.setTitulo("Quiz 2 de " + categoria.getNombre());

        quiz2.setDescripcion("Segunda parte del vocabulario");

        quiz2.setCategoriaId(categoria.getId());

        quiz2.setPreguntas(new ArrayList<>());

        for (Vocabulario v : segundaMitad) {

            Pregunta p = new Pregunta();

            p.setId(UUID.randomUUID().toString());

            p.setEnunciado(
                    "¿Cómo se dice '"
                    + v.getPalabraEspanol()
                    + "' en inglés?"
            );

            p.setRespuesta(v.getPalabraIngles());

            p.setTipoPregunta("ESP_A_ING");

            quiz2.getPreguntas().add(p);
        }

        Quiz quiz2Guardado = quizRepository.save(quiz2);

        categoria.getQuizIds().add(quiz2Guardado.getId());

        // =========================================
        // 🔥 QUIZ 3 → TODAS LAS PREGUNTAS
        // =========================================
        Quiz quiz3 = new Quiz();

        quiz3.setId(UUID.randomUUID().toString());

        quiz3.setTitulo("Quiz Final de " + categoria.getNombre());

        quiz3.setDescripcion("Quiz completo de la categoría");

        quiz3.setCategoriaId(categoria.getId());

        quiz3.setPreguntas(new ArrayList<>());

        for (Vocabulario v : vocabularios) {

            Pregunta p = new Pregunta();

            p.setId(UUID.randomUUID().toString());

            p.setEnunciado(
                    "¿Cómo se dice '"
                    + v.getPalabraEspanol()
                    + "' en inglés?"
            );

            p.setRespuesta(v.getPalabraIngles());

            p.setTipoPregunta("ESP_A_ING");

            quiz3.getPreguntas().add(p);
        }

        Quiz quiz3Guardado = quizRepository.save(quiz3);

        categoria.getQuizIds().add(quiz3Guardado.getId());

        // =========================================
        // GUARDAR CAMBIOS
        // =========================================
        categoria = categoriaRepository.save(categoria);

        return convertirACategoriaCompletaDTO(categoria);
    }

    // =========================================================
    // 🔥 CONVERTIR DTO
    // =========================================================
    private CategoriaCompletaDTO convertirACategoriaCompletaDTO(
            Categoria categoria) {

        CategoriaCompletaDTO dto = new CategoriaCompletaDTO();

        dto.setId(categoria.getId());

        dto.setNombre(categoria.getNombre());

        dto.setDescripcion(categoria.getDescripcion());

        dto.setNivel(categoria.getNivel());

        // =========================================
        // VOCABULARIOS
        // =========================================
        if (categoria.getVocabularios() != null) {

            dto.setVocabularios(
                    categoria.getVocabularios().stream()
                            .map(v -> {

                                VocabularioInfoDTO vDto
                                        = new VocabularioInfoDTO();

                                vDto.setId(v.getId());

                                vDto.setPalabraIngles(
                                        v.getPalabraIngles()
                                );

                                vDto.setPalabraEspanol(
                                        v.getPalabraEspanol()
                                );

                                vDto.setPronunciacion(
                                        v.getPronunciacion()
                                );

                                return vDto;

                            }).collect(Collectors.toList())
            );
        }

        return dto;
    }

    // =========================================================
    // 🔥 OBTENER CATEGORÍA
    // =========================================================
    public CategoriaCompletaDTO obtenerCategoriaCompleta(
            String categoriaId) {

        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        return convertirACategoriaCompletaDTO(categoria);
    }
}
