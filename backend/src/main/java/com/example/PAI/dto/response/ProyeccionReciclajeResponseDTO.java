package com.example.PAI.dto.response;

public class ProyeccionReciclajeResponseDTO {

    private int cantidadMuestras;
    private double pendiente;
    private double intercepto;
    private int periodoProyectado;
    private double valorProyectado;
    private String tendencia;

    public ProyeccionReciclajeResponseDTO(
            int cantidadMuestras,
            double pendiente,
            double intercepto,
            int periodoProyectado,
            double valorProyectado,
            String tendencia) {
        this.cantidadMuestras = cantidadMuestras;
        this.pendiente = pendiente;
        this.intercepto = intercepto;
        this.periodoProyectado = periodoProyectado;
        this.valorProyectado = valorProyectado;
        this.tendencia = tendencia;
    }

    public int getCantidadMuestras() {
        return cantidadMuestras;
    }

    public double getPendiente() {
        return pendiente;
    }

    public double getIntercepto() {
        return intercepto;
    }

    public int getPeriodoProyectado() {
        return periodoProyectado;
    }

    public double getValorProyectado() {
        return valorProyectado;
    }

    public String getTendencia() {
        return tendencia;
    }
}