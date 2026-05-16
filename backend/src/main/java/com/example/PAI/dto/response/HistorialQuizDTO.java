package com.example.PAI.dto.response;

import lombok.Data;
import java.util.Date;

@Data
public class HistorialQuizDTO {
    private Date fechaRealizacion;
    private double puntaje;
    private int numeroIntento;
    private String nombreCategoria;
    private String tituloQuiz;

    public HistorialQuizDTO(Date fechaRealizacion, double puntaje, int numeroIntento,
            String nombreCategoria, String tituloQuiz) {
        this.fechaRealizacion = fechaRealizacion;
        this.puntaje = puntaje;
        this.numeroIntento = numeroIntento;
        this.nombreCategoria = nombreCategoria;
        this.tituloQuiz = tituloQuiz;
    }
}
