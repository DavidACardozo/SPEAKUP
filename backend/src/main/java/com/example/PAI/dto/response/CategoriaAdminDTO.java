package com.example.PAI.dto.response;

import java.util.List;

import lombok.Data;

@Data
public class CategoriaAdminDTO {
    private String id;
    private String nombre;
    private String descripcion;
    private int nivel;
    private List<String> quizIds;
    private int cantidadVocabularios;
    private int cantidadPreguntas;
}
