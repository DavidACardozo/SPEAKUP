package com.example.PAI.dto.request;

import java.util.List;
import com.example.PAI.dto.response.VocabularioDTO;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearCategoriaDTO {
    private String nombre;
    private String descripcion;
    
    // Lo dejamos en plural para que coincida con la lógica del Service que te pasé
    private List<VocabularioDTO> vocabularios; 

    // Creamos dos Getters manuales: 
    // Uno para el Service (getVocabularios) y otro por si el Front manda singular
    public List<VocabularioDTO> getVocabularios() {
        return vocabularios;
    }

    public void setVocabularios(List<VocabularioDTO> vocabularios) {
        this.vocabularios = vocabularios;
    }
}