package com.example.PAI.dto.request;

import java.util.List;

import lombok.Data;
import com.example.PAI.dto.response.VocabularioDTO;

@Data
public class EditarCategoriaDTO {

    private String nombre;

    private String descripcion;

    private List<VocabularioDTO> vocabularios;
}