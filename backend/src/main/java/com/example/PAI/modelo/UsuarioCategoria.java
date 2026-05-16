package com.example.PAI.modelo;

import lombok.*;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioCategoria {

    @Id
    private String id;

    private String categoriaId;      
    private String categoriaNombre;  
    private int categoriaNivel;      
    private boolean desbloqueada = false;
}