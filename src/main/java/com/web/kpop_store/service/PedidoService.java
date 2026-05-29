package com.web.kpop_store.service;

import com.web.kpop_store.dto.DetallePedidoDTO;
import com.web.kpop_store.dto.PedidoDTO;
import com.web.kpop_store.entity.*;
import com.web.kpop_store.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final VarianteRepository varianteRepository;

    public PedidoService(PedidoRepository pedidoRepository, UsuarioRepository usuarioRepository, VarianteRepository varianteRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.varianteRepository = varianteRepository;
    }

    public PedidoDTO crear(PedidoDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setFecha(LocalDateTime.now());
        pedido.setEstado("PENDIENTE");

        List<DetallePedido> detalles = dto.getDetalles().stream().map(d -> {
            Variante v = varianteRepository.findById(d.getVarianteId())
                    .orElseThrow(() -> new RuntimeException("Variante no encontrada"));
            v.setStock(v.getStock() - d.getCantidad());
            varianteRepository.save(v);

            DetallePedido det = new DetallePedido();
            det.setPedido(pedido);
            det.setVariante(v);
            det.setCantidad(d.getCantidad());
            det.setPrecioUnitario(v.getPrecio());
            return det;
        }).collect(Collectors.toList());

        pedido.setDetalles(detalles);
        pedido.setTotal(detalles.stream()
                .mapToDouble(d -> d.getPrecioUnitario() * d.getCantidad()).sum());

        return toDTO(pedidoRepository.save(pedido));
    }

    public List<PedidoDTO> listar() {
        return pedidoRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public PedidoDTO obtenerPorId(Long id) {
        return toDTO(pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado")));
    }

    public PedidoDTO cambiarEstado(Long id, String estado) {
        Pedido p = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        p.setEstado(estado);
        return toDTO(pedidoRepository.save(p));
    }

    private PedidoDTO toDTO(Pedido p) {
        PedidoDTO dto = new PedidoDTO();
        dto.setId(p.getId());
        dto.setUsuarioId(p.getUsuario().getId());
        dto.setUsuarioNombre(p.getUsuario().getNombre());
        dto.setFecha(p.getFecha());
        dto.setEstado(p.getEstado());
        dto.setTotal(p.getTotal());
        if (p.getDetalles() != null) {
            dto.setDetalles(p.getDetalles().stream().map(d -> {
                DetallePedidoDTO dd = new DetallePedidoDTO();
                dd.setId(d.getId());
                dd.setVarianteId(d.getVariante().getId());
                dd.setVarianteDescripcion(d.getVariante().getDescripcion());
                dd.setCantidad(d.getCantidad());
                dd.setPrecioUnitario(d.getPrecioUnitario());
                return dd;
            }).collect(Collectors.toList()));
        }
        return dto;
    }
}