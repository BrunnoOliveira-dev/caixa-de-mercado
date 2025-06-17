package com.example.demo.service;

import com.example.demo.entity.Produto;
import com.example.demo.entity.Venda;
import com.example.demo.repository.VendaRepository;
import com.example.demo.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VendaService {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Venda> listarTodos() {
        return vendaRepository.findAll();
    }

    public Optional<Venda> buscarPorId(Long id) {
        return vendaRepository.findById(id);
    }

    public Venda salvar(Venda venda) {
        // Busca os produtos reais do banco e calcula as quantidades
        Map<Long, Long> quantidadePorProduto = venda.getProdutos().stream()
            .collect(Collectors.groupingBy(
                p -> p.getProduto_id(), Collectors.counting()
            ));
        List<Produto> produtosPersistidos = quantidadePorProduto.keySet().stream()
            .map(id -> produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + id)))
            .toList();

        // Verifica se há estoque suficiente para cada produto
        for (Produto produto : produtosPersistidos) {
            long quantidadeNoCarrinho = quantidadePorProduto.get(produto.getProduto_id());
            if (produto.getQuantidadeEstoque() == null || produto.getQuantidadeEstoque() < quantidadeNoCarrinho) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + produto.getNome());
            }
        }

        // Diminui o estoque corretamente
        for (Produto produto : produtosPersistidos) {
            long quantidadeNoCarrinho = quantidadePorProduto.get(produto.getProduto_id());
            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - (int)quantidadeNoCarrinho);
            produtoRepository.save(produto);
        }

        // Atualiza a lista de produtos da venda para conter apenas uma ocorrência de cada produto
        venda.setProdutos(produtosPersistidos);
        return vendaRepository.save(venda);
    }

    public void deletar(Long id) {
        vendaRepository.deleteById(id);
    }
}