package com.biblioteca.backend.service;

import com.biblioteca.backend.entity.User;
import com.biblioteca.backend.entity.Pontuacao;
import com.biblioteca.backend.entity.HistoricoLeitura;
import com.biblioteca.backend.request.RegistrarLeituraDTO;
import com.biblioteca.backend.response.PontuacaoResponseDTO;
import com.biblioteca.backend.repository.PontuacaoRepository;
import com.biblioteca.backend.repository.HistoricoLeituraRepository;
import org.springframework.stereotype.Service;
import org.springframework.stereotype.Component;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service

public class GamificacaoService {
    private static final long PONTOS_POR_SESSAO_LEITURA = 20L;
    private static final long TEMPO_MINIMO_ENTRE_PONTOS_SEGUNDOS = 10;
    private static final Logger log = LoggerFactory.getLogger(GamificacaoService.class);

    private final PontuacaoRepository pontuacaoRepository;
    private final NivelarPontuacaoService nivelarPontuacaoService;
    private final HistoricoLeituraRepository historicoLeituraRepository;
    private final PontuacaoCreator pontuacaoCreator;

    public GamificacaoService(
            PontuacaoRepository pontuacaoRepository,
            HistoricoLeituraRepository historicoLeituraRepository,
            NivelarPontuacaoService nivelarPontuacaoService,
            PontuacaoCreator pontuacaoCreator){

        this.pontuacaoRepository = pontuacaoRepository;
        this.historicoLeituraRepository = historicoLeituraRepository;
        this.nivelarPontuacaoService = nivelarPontuacaoService;
        this.pontuacaoCreator = pontuacaoCreator;
    }

    @Transactional
    public Pontuacao garantirPontuacao(User user){
        Optional<Pontuacao> pontuacaoOpt = pontuacaoRepository.findByUser(user);

        if (pontuacaoOpt.isPresent()) {
            return pontuacaoOpt.get();
        }
        try {
            return pontuacaoCreator.criarPontuacaoEmNovaTransacao(user);
        } catch (DataIntegrityViolationException e) {
            log.warn("Falha de concorrência (chave duplicada) ao criar Pontuacao para User ID: {}. Rebuscando registro existente.", user.getId());
            return pontuacaoCreator.rebuscarPontuacaoEmCasoDeFalha(user);
        }
    }

    @Transactional(readOnly = false)
    public PontuacaoResponseDTO buscarPontuacaoUser(User user) {
        Pontuacao pontuacao = garantirPontuacao(user);
        return new PontuacaoResponseDTO(pontuacao.getPontos(), pontuacao.getNivel());
    }

    @Transactional
    public Pontuacao adicionarPontos(User user, Long pontosAdicionados){

        Pontuacao pontuacao = garantirPontuacao(user);
        pontuacao.adicionarPontos(pontosAdicionados);

        aplicarNivelamento(pontuacao, user);

        return pontuacaoRepository.save(pontuacao);
    }

    @Transactional
    public void deletarPontuacao(User user){
        log.info("Deletando registro de pontuação para o Usuário ID: {}", user.getId());
        pontuacaoRepository.deleteByUser(user);
    }

    private void aplicarNivelamento(Pontuacao pontuacao, User user) {
        int nivelAntigo = pontuacao.getNivel();
        int nivelNovo = nivelarPontuacaoService.calcularNovoNivel(pontuacao.getPontos());

        if (nivelNovo > nivelAntigo){
            pontuacao.setNivel(nivelNovo);
            log.info("Usuário {} subiu de nível. De {} para {}. Pontos totais: {}",
                    user.getId(), nivelAntigo, nivelNovo, pontuacao.getPontos());
        }
    }

    @Transactional
    public Pontuacao concederPontosPorLeitura(User user, RegistrarLeituraDTO request){
        Pontuacao pontuacao = garantirPontuacao(user);
        Instant agora = Instant.now();

        Instant proximaPontuacaoPermitida = Optional.ofNullable(pontuacao.getUltimaPontuacaoLeitura())
                .map(lastTime -> lastTime.plusSeconds(TEMPO_MINIMO_ENTRE_PONTOS_SEGUNDOS))
                .orElse(Instant.MIN);

        if (agora.isAfter(proximaPontuacaoPermitida) || agora.equals(proximaPontuacaoPermitida)){

            pontuacao.adicionarPontos(PONTOS_POR_SESSAO_LEITURA);
            pontuacao.setUltimaPontuacaoLeitura(agora);

            int nivelNovo = nivelarPontuacaoService.calcularNovoNivel(pontuacao.getPontos());
            pontuacao.setNivel(nivelNovo);

            log.info("Pontos concedidos para User ID {}: {} pontos. Total: {}", user.getId(), PONTOS_POR_SESSAO_LEITURA, pontuacao.getPontos());

        } else {
            log.info("Pontuação rejeitada para User ID {}. Tempo mínimo de {}s não atingido.", user.getId(), TEMPO_MINIMO_ENTRE_PONTOS_SEGUNDOS);
        }

        HistoricoLeitura historico = new HistoricoLeitura(
                user,
                request.getIdLivro(),
                request.getPaginaLida()
        );
        historicoLeituraRepository.save(historico);

        return pontuacaoRepository.save(pontuacao);
    }
    public Optional<Pontuacao> buscarPontuacaoPorUser(User user){
        return pontuacaoRepository.findByUser(user);
    }

    @Component
    public static class PontuacaoCreator {
        private static final Logger log = LoggerFactory.getLogger(PontuacaoCreator.class);
        private final PontuacaoRepository pontuacaoRepository;

        public PontuacaoCreator(PontuacaoRepository pontuacaoRepository) {
            this.pontuacaoRepository = pontuacaoRepository;
        }

        @Transactional(propagation = Propagation.REQUIRES_NEW)
        public Pontuacao criarPontuacaoEmNovaTransacao(User user) {
            log.info("Tentando criar novo registro de Pontuacao (REQUIRES_NEW) para User ID: {}", user.getId());
            Pontuacao novaPontuacao = new Pontuacao(user);
            return pontuacaoRepository.saveAndFlush(novaPontuacao);
        }
        @Transactional(propagation = Propagation.REQUIRES_NEW, readOnly = true)
        public Pontuacao rebuscarPontuacaoEmCasoDeFalha(User user) {
            log.info("Executando re-busca em transação REQUIRES_NEW limpa para User ID: {}", user.getId());
            return pontuacaoRepository.findByUser(user)
                    .orElseThrow(() -> new IllegalStateException("Registro de Pontuação deve existir após falha de chave duplicada. User ID: " + user.getId()));
        }
    }
}