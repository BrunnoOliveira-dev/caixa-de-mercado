package com.example.demo.controller;

import com.example.demo.entity.Produto;
import com.example.demo.entity.funcionario.Funcionario;
import com.example.demo.service.ProdutoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    // DTO
    public static class ProdutoResponse {
        public Long produto_id;
        public String codigoBarras;
        public BigDecimal precoUnitario;
        public String nome;
        public BigDecimal desconto;
        public String marca;
        public Integer quantidadeEstoque;

        public ProdutoResponse(Produto produto) {
            this.produto_id = produto.getProduto_id();
            this.codigoBarras = produto.getCodigoBarras();
            this.precoUnitario = produto.getPrecoUnitario();
            this.nome = produto.getNome();
            this.desconto = produto.getDesconto();
            this.marca = produto.getMarca();
            this.quantidadeEstoque = produto.getQuantidadeEstoque();
        }
    }


    @GetMapping
    public List<Produto> listarTodos() {
        return produtoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        Optional<Produto> produto = produtoService.buscarPorId(id);
        return produto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/barras/{codigo}")
    public ResponseEntity<ProdutoResponse> buscarPorCodigoBarras(@PathVariable String codigo) {
        Optional<Produto> produto = produtoService.buscarPorCodigoBarras(codigo);
        return produto
                .map(p -> ResponseEntity.ok(new ProdutoResponse(p)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> salvar(@RequestBody Produto produto) {
        try {
            Produto salvo = produtoService.salvar(produto);
            return ResponseEntity.ok(salvo);
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(409).body("Já existe um produto cadastrado com esse código de barras.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao cadastrar produto: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Produto produtoAtualizado) {
        Optional<Produto> optProduto = produtoService.buscarPorId(id);
        if (optProduto.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Produto produto = optProduto.get();
        // Atualiza apenas os campos permitidos
        produto.setNome(produtoAtualizado.getNome());
        produto.setMarca(produtoAtualizado.getMarca());
        produto.setPrecoUnitario(produtoAtualizado.getPrecoUnitario());
        produto.setDesconto(produtoAtualizado.getDesconto());
        produto.setCodigoBarras(produtoAtualizado.getCodigoBarras());
        // Atualiza o estoque (pode ser incremento ou valor absoluto)
        produto.setQuantidadeEstoque(produtoAtualizado.getQuantidadeEstoque());
        produtoService.salvar(produto);
        return ResponseEntity.ok(new ProdutoResponse(produto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        produtoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}