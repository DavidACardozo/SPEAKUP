package com.example.PAI.services;

import com.example.PAI.dto.request.ProyeccionReciclajeRequestDTO;
import com.example.PAI.dto.response.ProyeccionReciclajeResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegresionLinealService {

    public ProyeccionReciclajeResponseDTO calcularProyeccion(ProyeccionReciclajeRequestDTO request) {
        List<Double> yValues = request.getValoresHistoricos();
        if (yValues == null || yValues.size() < 2) {
            throw new IllegalArgumentException("Se requieren al menos 2 registros históricos para calcular la regresión lineal.");
        }

        int n = yValues.size();
        double sumX = 0.0;
        double sumY = 0.0;
        double sumXY = 0.0;
        double sumX2 = 0.0;

        for (int i = 0; i < n; i++) {
            double x = i + 1.0;
            double y = yValues.get(i);
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
        }

        double denominador = (n * sumX2) - (sumX * sumX);
        double pendiente = denominador != 0 ? ((n * sumXY) - (sumX * sumY)) / denominador : 0.0;
        double intercepto = (sumY - (pendiente * sumX)) / n;

        int pasos = (request.getPasosFuturos() == null || request.getPasosFuturos() < 1)
                ? 1
                : request.getPasosFuturos();
        int periodoFuturo = n + pasos;
        double valorProyectado = redondear((pendiente * periodoFuturo) + intercepto);

        String tendencia;
        if (pendiente > 0.01) {
            tendencia = "Creciente";
        } else if (pendiente < -0.01) {
            tendencia = "Decreciente";
        } else {
            tendencia = "Estable";
        }

        return new ProyeccionReciclajeResponseDTO(
                n,
                redondear(pendiente),
                redondear(intercepto),
                periodoFuturo,
                Math.max(0.0, valorProyectado),
                tendencia
        );
    }

    private double redondear(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}