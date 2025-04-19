package com.biblioteca.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmailRedefinicaoSenha(String paraEmail, String token) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(paraEmail);
        message.setSubject("Redefinição de Senha - Biblioteca Virtual Pública");
        String linkRedefinicao = "http://localhost:8080/redefinir-senha?token=" + token;
        message.setText("Você solicitou a redefinição da sua senha. Para continuar, clique no link abaixo:\n\n" + linkRedefinicao + "\n\nSe você não solicitou esta redefinição, ignore este e-mail.");
        mailSender.send(message);
    }

}
