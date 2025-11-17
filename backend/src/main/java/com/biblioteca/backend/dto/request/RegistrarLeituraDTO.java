package com.biblioteca.backend.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class RegistrarLeituraDTO {
    private String idLivro;
    private Integer paginaLida;

    public RegistrarLeituraDTO() {
    }

    public RegistrarLeituraDTO(String idLivro, Integer paginaLida) {
        this.idLivro = idLivro;
        this.paginaLida = paginaLida;
    }
}