// PreguntaQuizDTO.java
package com.example.PAI.dto.response;

import lombok.Data;

@Data
public class PreguntaQuizDTO {
    private String id;
    private String enunciado;
    private String tipoPregunta;

    // SIN respuesta correcta
    // SIN relaciones completas

    public PreguntaQuizDTO(String id, String enunciado, String tipoPregunta) {
        this.id = id;
        this.enunciado = enunciado;
        this.tipoPregunta = tipoPregunta;
    }
}