package com.example.PAI.dto.response;

import lombok.Data;

@Data
public class ResultadoQuizResponseDTO {
    private double puntaje;
    private int totalPreguntas;
    private int correctas;
    private boolean categoriaDesbloqueada;
    private String mensaje;

    public ResultadoQuizResponseDTO(double puntaje, int totalPreguntas, int correctas,
            boolean categoriaDesbloqueada, String mensaje) {
        this.puntaje = puntaje;
        this.totalPreguntas = totalPreguntas;
        this.correctas = correctas;
        this.categoriaDesbloqueada = categoriaDesbloqueada;
        this.mensaje = mensaje;
    }
}