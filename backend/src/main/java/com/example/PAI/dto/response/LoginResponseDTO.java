package com.example.PAI.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String tipo; 
    private Object datos; 
    private String mensaje;
    private boolean success;

    // Constructor para LOGIN EXITOSO (4 parámetros como pide tu Service)
    public LoginResponseDTO(String token, String tipo, Object datos, String mensaje) {
        this.token = token;
        this.tipo = tipo;
        this.datos = datos;
        this.mensaje = mensaje;
        this.success = true;
    }

    // Constructor para LOGIN FALLIDO (1 parámetro)
    public LoginResponseDTO(String mensaje) {
        this.mensaje = mensaje;
        this.success = false;
    }
}