package com.example.demo.controller;

import com.example.demo.entity.funcionario.Caixa;
import com.example.demo.service.CaixaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/caixas")
public class CaixaController {

    @Autowired
    private CaixaService CaixaService;

    @GetMapping
    public List<Caixa> listarTodos() {
        return CaixaService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Caixa> buscarPorId(@PathVariable Long id) {
        Optional<Caixa> Caixa = CaixaService.buscarPorId(id);
        return Caixa.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Caixa salvar(@RequestBody Caixa Caixa) {
        return CaixaService.salvar(Caixa);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        CaixaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}