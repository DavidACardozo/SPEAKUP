package com.example.PAI.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaDesbloqueadaResponseDTO {

    private String id;

    private String nombre;

    private String descripcion;

    private int nivel;

    // =====================================================
    // 🔥 CAMBIO → AHORA ES LISTA DE QUIZZES
    // =====================================================
    private List<String> quizIds;

    private List<VocabularioInfoDTO> vocabularios;

    private boolean completada;
}