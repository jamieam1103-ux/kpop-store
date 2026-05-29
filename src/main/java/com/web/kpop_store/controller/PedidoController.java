package com.web.kpop_store.controller;

import com.web.kpop_store.dto.PedidoDTO;
import com.web.kpop_store.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<PedidoDTO> crear(@RequestBody PedidoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pedidoService.crear(dto));
    }

    @GetMapping
    public ResponseEntity<List<PedidoDTO>> listar() {
        return ResponseEntity.ok(pedidoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.obtenerPorId(id));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<PedidoDTO> cambiarEstado(
            @PathVariable Long id, @RequestParam String estado) {
        return ResponseEntity.ok(pedidoService.cambiarEstado(id, estado));
    }
}