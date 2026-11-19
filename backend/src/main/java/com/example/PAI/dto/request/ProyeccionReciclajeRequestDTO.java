package com.example.PAI.dto.request;

import java.util.List;

public class ProyeccionReciclajeRequestDTO {

    private List<Double> valoresHistoricos;
    private Integer pasosFuturos = 1;

    public List<Double> getValoresHistoricos() {
        return valoresHistoricos;
    }

    public void setValoresHistoricos(List<Double> valoresHistoricos) {
        this.valoresHistoricos = valoresHistoricos;
    }

    public Integer getPasosFuturos() {
        return pasosFuturos;
    }

    public void setPasosFuturos(Integer pasosFuturos) {
        this.pasosFuturos = pasosFuturos;
    }
}