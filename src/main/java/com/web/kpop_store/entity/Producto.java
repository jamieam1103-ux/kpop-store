package com.web.kpop_store.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    private String imagen;

    @Column(nullable = false)
    private String categoria; // KPOP, ANIME, etc.

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL)
    private List<Variante> variantes;
}