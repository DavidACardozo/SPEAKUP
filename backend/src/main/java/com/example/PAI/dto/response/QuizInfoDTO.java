package com.example.PAI.dto.response;

import java.util.List;

import lombok.Data;

@Data
public class QuizInfoDTO {
    private String id;
    private String titulo;
    private List<PreguntaCompletaDTO> preguntas;
}
