package com.example.PAI.modelo;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "categorias")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categoria {

    @Id
    private String id;

    private String nombre;
    private String descripcion;
    private int nivel;
    private String quizId;

    private List<Vocabulario> vocabularios = new ArrayList<>();
}