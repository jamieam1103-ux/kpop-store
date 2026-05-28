package com.web.kpop_store.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductoDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private String imagen;
    private String categoria;
    private List<VarianteDTO> variantes;
}