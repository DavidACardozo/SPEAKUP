package com.example.PAI.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.PAI.dto.request.CrearCategoriaDTO;
import com.example.PAI.dto.response.CategoriaCompletaDTO;
import com.example.PAI.dto.response.PreguntaCompletaDTO;
import com.example.PAI.dto.response.QuizInfoDTO;
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
    private final QuizRepository quizRepository;  // ← NUEVO: para guardar quizzes separados

    @Transactional
    public CategoriaCompletaDTO crearCategoria(CrearCategoriaDTO request) {
        // 1. Calcular nuevo nivel basado en el último registro
        int nuevoNivel = categoriaRepository.findFirstByOrderByNivelDesc()
                .map(Categoria::getNivel)
                .orElse(0) + 1;
        
        // 2. Instanciar y configurar la categoría
        Categoria categoria = new Categoria();
        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());
        categoria.setNivel(nuevoNivel);
        
        // INICIALIZACIÓN DE LISTAS EMBEBIDAS
        categoria.setVocabularios(new ArrayList<>());
        
        // 3. Crear el Quiz como colección SEPARADA (NO embebido)
        Quiz nuevoQuiz = new Quiz();
        nuevoQuiz.setId(UUID.randomUUID().toString());
        nuevoQuiz.setTitulo("Quiz de " + request.getNombre());
        nuevoQuiz.setCategoriaId(categoria.getId());  // ← relación por ID
        nuevoQuiz.setPreguntas(new ArrayList<>());
        
        // 4. Procesar vocabularios y generar preguntas automáticamente
        if (request.getVocabularios() != null && !request.getVocabularios().isEmpty()) {
            for (VocabularioDTO vReq : request.getVocabularios()) {
                
                // Crear la entidad Vocabulario (embebido en Categoria)
                Vocabulario v = new Vocabulario();
                v.setId(UUID.randomUUID().toString());
                v.setPalabraIngles(vReq.getPalabraIngles());
                v.setPalabraEspanol(vReq.getPalabraEspanol());
                v.setPronunciacion(vReq.getPronunciacion());
                
                categoria.getVocabularios().add(v);

                // Crear la Pregunta asociada a este vocabulario (embebida en Quiz)
                Pregunta p = new Pregunta();
                p.setId(UUID.randomUUID().toString());
                p.setEnunciado("¿Cómo se dice '" + vReq.getPalabraEspanol() + "' en inglés?");
                p.setRespuesta(vReq.getPalabraIngles());
                p.setTipoPregunta("ESP_A_ING");
                
                nuevoQuiz.getPreguntas().add(p);
            }
        }
        
        // 5. Guardar primero la categoría (para tener ID)
        categoria = categoriaRepository.save(categoria);
        
        // 6. Actualizar el quiz con el ID correcto de la categoría y guardar
        nuevoQuiz.setCategoriaId(categoria.getId());
        Quiz quizGuardado = quizRepository.save(nuevoQuiz);
        
        // 7. Actualizar la categoría con el quizId
        categoria.setQuizId(quizGuardado.getId());
        categoria = categoriaRepository.save(categoria);
        
        // 8. Devolver la respuesta mapeada al DTO completo
        return convertirACategoriaCompletaDTO(categoria, quizGuardado);
    }

    private CategoriaCompletaDTO convertirACategoriaCompletaDTO(Categoria categoria, Quiz quiz) {
        CategoriaCompletaDTO dto = new CategoriaCompletaDTO();
        dto.setId(categoria.getId()); 
        dto.setNombre(categoria.getNombre());
        dto.setDescripcion(categoria.getDescripcion());
        dto.setNivel(categoria.getNivel());
        
        // Mapeo del Quiz (ahora viene como parámetro separado)
        if (quiz != null) {
            QuizInfoDTO quizDTO = new QuizInfoDTO();
            quizDTO.setId(quiz.getId());
            quizDTO.setTitulo(quiz.getTitulo());
            
            if (quiz.getPreguntas() != null) {
                List<PreguntaCompletaDTO> preguntasDTO = quiz.getPreguntas().stream()
                    .map(p -> {
                        PreguntaCompletaDTO pDto = new PreguntaCompletaDTO();
                        pDto.setId(p.getId());
                        pDto.setEnunciado(p.getEnunciado());
                        pDto.setRespuesta(p.getRespuesta());
                        pDto.setTipoPregunta(p.getTipoPregunta());
                        return pDto;
                    }).collect(Collectors.toList());
                quizDTO.setPreguntas(preguntasDTO);
            }
            dto.setQuiz(quizDTO);
        }

        // Mapeo de la lista de Vocabularios
        if (categoria.getVocabularios() != null) {
            dto.setVocabularios(categoria.getVocabularios().stream()
                .map(v -> {
                    VocabularioInfoDTO vDto = new VocabularioInfoDTO();
                    vDto.setId(v.getId());
                    vDto.setPalabraIngles(v.getPalabraIngles());
                    vDto.setPalabraEspanol(v.getPalabraEspanol());
                    vDto.setPronunciacion(v.getPronunciacion());
                    return vDto;
                }).collect(Collectors.toList()));
        } else {
            dto.setVocabularios(new ArrayList<>());
        }
        
        return dto;
    }
    
    // Método adicional para obtener categoría con su quiz
    public CategoriaCompletaDTO obtenerCategoriaCompleta(String categoriaId) {
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        
        Quiz quiz = quizRepository.findById(categoria.getQuizId())
                .orElse(null);
        
        return convertirACategoriaCompletaDTO(categoria, quiz);
    }
}