package com.example.PAI.dto.response;

import lombok.Data;

@Data
public class PreguntaCompletaDTO {
    private String id;
    private String enunciado;
    private String respuesta; 
    private String tipoPregunta;
    private String vocabularioId; 
}
