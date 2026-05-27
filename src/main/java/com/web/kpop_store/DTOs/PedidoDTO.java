package com.web.kpop_store.DTOs;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PedidoDTO {

    private Long id;
    private Long usuarioId;
    private String usuarioNombre;
    private LocalDateTime fecha;
    private String estado; // PENDIENTE, PAGADO, CANCELADO
    private Double total;
    private List<DetallePedidoDTO> detalles;
}