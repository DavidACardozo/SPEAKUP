package com.example.PAI.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.PAI.dto.request.LoginRequestDTO;
import com.example.PAI.dto.request.RegistroRequestDTO;
import com.example.PAI.dto.response.LoginResponseDTO;
import com.example.PAI.dto.response.RegistroResponseDTO; 
import com.example.PAI.services.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
public class AuthController {

    private final UsuarioService usuarioService;

    @PostMapping("/registro")
    public ResponseEntity<RegistroResponseDTO> registrarUsuario(
            @RequestBody RegistroRequestDTO registroRequest) { 
        try {
            RegistroResponseDTO responseDTO = usuarioService.registrarUsuario(registroRequest); 
            return ResponseEntity.ok(responseDTO); 
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                new RegistroResponseDTO(e.getMessage(), null, null) 
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            LoginResponseDTO response = usuarioService.iniciarSesion(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new LoginResponseDTO(e.getMessage()));
        }
    }
}