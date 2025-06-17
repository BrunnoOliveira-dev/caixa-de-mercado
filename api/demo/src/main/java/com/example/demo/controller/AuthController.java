package com.example.demo.controller;

import com.example.demo.config.JwtUtil;
import com.example.demo.entity.funcionario.Funcionario;
import com.example.demo.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FuncionarioService funcionarioService;

    @Autowired
    private JwtUtil jwtUtil;

    // DTO para login
    public static class LoginRequest {
        public String email;
        public String senha;
    }

    // DTO para retorno de login
    public static class LoginResponse {
        public Long id;
        public String nome;
        public String email;
        public String tipo;
        public String token;

        public LoginResponse(Funcionario funcionario, String token) {
            this.id = funcionario.getId();
            this.nome = funcionario.getNome();
            this.email = funcionario.getEmail();
            this.tipo = funcionario.getTipo() != null ? funcionario.getTipo().name() : null;
            this.token = token;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Optional<Funcionario> funcionarioOpt = funcionarioService.buscarPorEmail(loginRequest.email);
        if (funcionarioOpt.isPresent() && passwordEncoder.matches(loginRequest.senha, funcionarioOpt.get().getSenha())) {
            Funcionario funcionario = funcionarioOpt.get();
            String token = jwtUtil.generateToken(funcionario.getEmail());
            LoginResponse loginResponse = new LoginResponse(funcionario, token);
            return ResponseEntity.ok(loginResponse);
        } else {
            return ResponseEntity.status(401).body("Usuário ou senha inválidos");
        }
    }
}

