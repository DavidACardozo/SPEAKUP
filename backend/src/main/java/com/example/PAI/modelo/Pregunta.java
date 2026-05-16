package com.example.PAI.modelo;

import lombok.*;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pregunta {

    @Id
    private String id;

    private String enunciado;
    private String respuesta;
    private String tipoPregunta;
}