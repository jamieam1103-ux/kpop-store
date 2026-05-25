package com.web.kpop_store.dto;

import lombok.Data;

@Data
public class VarianteDTO {

    private Long id;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private Integer stockMinimo;
}