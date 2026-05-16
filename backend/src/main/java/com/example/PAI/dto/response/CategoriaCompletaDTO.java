package com.example.PAI.dto.response;

import java.util.List;

import lombok.Data;

@Data
public class CategoriaCompletaDTO {
    private String id;
    private String nombre;
    private String descripcion;
    private int nivel;
    private QuizInfoDTO quiz;
    private List<VocabularioInfoDTO> vocabularios;
}