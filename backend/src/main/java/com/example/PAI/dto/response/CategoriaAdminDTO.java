package com.example.PAI.dto.response;

import lombok.Data;

@Data
public class CategoriaAdminDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private int nivel;
    private Long quizId;
    private int cantidadVocabularios;
    private int cantidadPreguntas;
}