package com.example.PAI.modelo;

import lombok.*;
import org.springframework.data.annotation.Id;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioQuiz {

    @Id
    private String id;

    private String quizId;       
    private String quizTitulo;   

    private Date fechaRealizacion = new Date();
    private double puntaje;
    private int intentos;
}