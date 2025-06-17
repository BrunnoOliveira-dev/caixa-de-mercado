package com.example.demo.service;

import com.example.demo.entity.funcionario.Caixa;
import com.example.demo.repository.CaixaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CaixaService {

    @Autowired
    private CaixaRepository CaixaRepository;

    public List<Caixa> listarTodos() {
        return CaixaRepository.findAll();
    }

    public Optional<Caixa> buscarPorId(Long id) {
        return CaixaRepository.findById(id);
    }

    public Caixa salvar(Caixa Caixa) {
        return CaixaRepository.save(Caixa);
    }

    public void deletar(Long id) {
        CaixaRepository.deleteById(id);
    }
}