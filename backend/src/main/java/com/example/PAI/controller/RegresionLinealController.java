package com.example.PAI.controller;

import com.example.PAI.dto.request.ProyeccionReciclajeRequestDTO;
import com.example.PAI.dto.response.ProyeccionReciclajeResponseDTO;
import com.example.PAI.services.RegresionLinealService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reciclaje/regresion-lineal")
public class RegresionLinealController {

    private final RegresionLinealService regresionLinealService;

    public RegresionLinealController(RegresionLinealService regresionLinealService) {
        this.regresionLinealService = regresionLinealService;
    }

    @PostMapping("/proyeccion")
    public ResponseEntity<ProyeccionReciclajeResponseDTO> proyectar(@RequestBody ProyeccionReciclajeRequestDTO request) {
        return ResponseEntity.ok(regresionLinealService.calcularProyeccion(request));
    }
}