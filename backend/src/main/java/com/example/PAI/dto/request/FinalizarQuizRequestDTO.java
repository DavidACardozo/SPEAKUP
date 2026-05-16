package com.example.PAI.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class FinalizarQuizRequestDTO {
    private String quizId;
    private List<RespuestaUsuarioDTO> respuestas;
}
