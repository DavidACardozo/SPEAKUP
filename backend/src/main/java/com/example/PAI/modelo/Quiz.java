package com.example.PAI.modelo;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "quizzes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Quiz {

    @Id
    private String id;

    private String titulo;
    private String descripcion;
    private String categoriaId; 

    private List<Pregunta> preguntas = new ArrayList<>();
}