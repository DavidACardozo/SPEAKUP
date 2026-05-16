package com.example.PAI.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VocabularioDTO {
    private String id;
    private String palabraIngles;
    private String palabraEspanol;
    private String pronunciacion;

    // Métodos manuales por si Lombok sigue molestando en Docker
    public String getPalabraIngles() { return palabraIngles; }
    public String getPalabraEspanol() { return palabraEspanol; }
    public String getPronunciacion() { return pronunciacion; }
}