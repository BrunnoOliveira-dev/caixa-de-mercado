package com.example.demo.config;

import com.example.demo.entity.funcionario.Funcionario;
import com.example.demo.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private FuncionarioService funcionarioService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Funcionario funcionario = funcionarioService.buscarPorEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(email));
        GrantedAuthority authority = new SimpleGrantedAuthority(
                funcionario.getTipo() != null ? funcionario.getTipo().name() : "USER");
        return new org.springframework.security.core.userdetails.User(
                funcionario.getEmail(), funcionario.getSenha(), Collections.singleton(authority));
    }
}
