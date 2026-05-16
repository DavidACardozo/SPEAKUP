package com.example.PAI.dto.response;

import java.util.Date;

import lombok.Data;

@Data
public class UsuarioResponseDTO {
    private String id; 
    private String nombre;
    private String apellido;
    private String email;
    private String username;
    private Date fechaRegistro;
}