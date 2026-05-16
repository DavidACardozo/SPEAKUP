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
    private String quizId;
    private List<VocabularioInfoDTO> vocabulario;
    private boolean completada; 
}