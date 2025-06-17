package com.example.demo.controller;

import com.example.demo.entity.funcionario.Funcionario;
import com.example.demo.service.FuncionarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/funcionarios")
public class FuncionarioController {

    @Autowired
    private FuncionarioService FuncionarioService;



    @GetMapping
    public List<Funcionario> listarTodos() {
        return FuncionarioService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> buscarPorId(@PathVariable Long id) {
        Optional<Funcionario> Funcionario = FuncionarioService.buscarPorId(id);
        return Funcionario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }



    @PostMapping
    public Funcionario salvar(@RequestBody Funcionario Funcionario) {
        return FuncionarioService.salvar(Funcionario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        FuncionarioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
