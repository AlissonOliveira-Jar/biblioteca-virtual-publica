package com.biblioteca.backend.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class RegistrarLeituraDTO {
    private Long livroId;
    private int paginasLidas;

    public RegistrarLeituraDTO() {
    }

    public RegistrarLeituraDTO(Long livroId, int paginasLidas) {
        this.livroId = livroId;
        this.paginasLidas = paginasLidas;
    }
}