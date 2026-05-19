package com.example.PAI.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.PAI.repository.UsuarioRepository;
import com.example.PAI.services.AdminService; //  NUEVO

import lombok.RequiredArgsConstructor;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminUsuarioController {

    private final UsuarioRepository usuarioRepository;
    private final AdminService adminService;

    //  NUEVO → LISTAR USUARIOS
   @GetMapping
public ResponseEntity<?> listarUsuarios() {
    return ResponseEntity.ok(adminService.listarUsuarios());
}

    // NUEVO → ELIMINAR USUARIO
  @DeleteMapping("/{id}")
public ResponseEntity<?> eliminarUsuario(@PathVariable String id) {
    try {
        return ResponseEntity.ok(adminService.eliminarUsuario(id));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

// ACTUALIZAR
@PutMapping("/{id}")
public ResponseEntity<?> actualizarUsuario(
        @PathVariable String id,
        @RequestBody Map<String, String> body) {

    try {

        String nombre = body.get("nombre");
        String email = body.get("email");
        String rol = body.get("rol");

        return ResponseEntity.ok(
                adminService.actualizarUsuario(id, nombre, email, rol)
        );

    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
}