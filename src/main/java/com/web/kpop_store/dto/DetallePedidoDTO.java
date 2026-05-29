package com.web.kpop_store.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class DetallePedidoDTO {
    private Long id;

    @NotNull
    private Long varianteId;

    private String varianteDescripcion;

    @NotNull @Min(1)
    private Integer cantidad;

    private Double precioUnitario;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getVarianteId() { return varianteId; }
    public void setVarianteId(Long varianteId) { this.varianteId = varianteId; }
    public String getVarianteDescripcion() { return varianteDescripcion; }
    public void setVarianteDescripcion(String varianteDescripcion) { this.varianteDescripcion = varianteDescripcion; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public Double getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(Double precioUnitario) { this.precioUnitario = precioUnitario; }
}