package com.biblioteca.backend.service;

import org.springframework.stereotype.Service;

@Service
public class NivelarPontuacaoService {
    private static final long PONTOS_BASE = 100;

    public int calcularNovoNivel(Long pontos){
        if (pontos == null || pontos < PONTOS_BASE){
            return 1;
        }
        int nivel = 1;
        long pontosNecessarios = PONTOS_BASE;
        while(pontos >= pontosNecessarios){
            nivel++;
            pontosNecessarios = (long) (PONTOS_BASE * (nivel * (nivel -1 )/ 2.0 + 1));

            if(nivel > 50) break;
        }

        return nivel -1;
    }
}