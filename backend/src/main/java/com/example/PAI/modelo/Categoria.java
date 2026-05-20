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

    // 🔥 NIVEL DE LA CATEGORÍA (se usa para desbloqueo progresivo)
    private int nivel;

    // =========================================================
    // 🔥 CAMBIO PRINCIPAL: UNA CATEGORÍA TIENE 3 QUIZZES
    // =========================================================
    // Antes: quizId (UNO SOLO) ❌
    // Ahora: lista de quizzes ✔
    private List<String> quizIds = new ArrayList<>();

    // =========================================================
    // VOCABULARIO DE LA CATEGORÍA (EMBEBIDO)
    // =========================================================
    private List<Vocabulario> vocabularios = new ArrayList<>();
}