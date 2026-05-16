package com.example.PAI.modelo;

import lombok.*;
import org.springframework.data.annotation.Id;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vocabulario {

    @Id
    private String id;

    private String palabraIngles;
    private String palabraEspanol;
    private String pronunciacion;

    private List<Pregunta> preguntas = new ArrayList<>();
}