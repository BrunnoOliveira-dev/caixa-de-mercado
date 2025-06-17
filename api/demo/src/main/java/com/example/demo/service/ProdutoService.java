package com.example.demo.service;

import com.example.demo.entity.Produto;
import com.example.demo.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository ProdutoRepository;

    public List<Produto> listarTodos() {
        return ProdutoRepository.findAll();
    }

    public Optional<Produto> buscarPorId(Long id) {
        return ProdutoRepository.findById(id);
    }

    public Optional<Produto> buscarPorCodigoBarras(String codigo) { return ProdutoRepository.findByCodigoBarras(codigo); }

    public Produto salvar(Produto Produto) {
        return ProdutoRepository.save(Produto);
    }

    public void deletar(Long id) {
        ProdutoRepository.deleteById(id);
    }
}

