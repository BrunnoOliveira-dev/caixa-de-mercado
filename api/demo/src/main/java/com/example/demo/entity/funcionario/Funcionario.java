package com.example.demo.entity.funcionario;

import com.example.demo.entity.TipoFuncionario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
public class Funcionario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(name = "CPF", unique = true, nullable = false, length = 11)
    private String cpf;

    @Column(name = "RG", unique = true, nullable = false, length = 8)
    private String rg;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String telefone;

    @Column(nullable = false)
    private String endereco;

    @Enumerated(EnumType.STRING)
    private TipoFuncionario tipo;

    @Column(nullable = false)
    private BigDecimal salario;



}