package com.web.kpop_store.service;

import com.web.kpop_store.dto.ProductoDTO;
import com.web.kpop_store.entity.Producto;
import com.web.kpop_store.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor  // ← Lombok genera el constructor = Dependency Injection
public class ProductoService {

    // ✅ DI por constructor (inyectado automáticamente por Spring)
    private final ProductoRepository productoRepository;

    public ProductoDTO crear(ProductoDTO dto) {
        Producto p = toEntity(dto);
        return toDTO(productoRepository.save(p));
    }

    public List<ProductoDTO> listar() {
        return productoRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ProductoDTO obtenerPorId(Long id) {
        return toDTO(buscarOLanzar(id));
    }

    public List<ProductoDTO> porCategoria(String categoria) {
        return productoRepository.findByCategoria(categoria)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public ProductoDTO actualizar(Long id, ProductoDTO dto) {
        Producto p = buscarOLanzar(id);
        p.setNombre(dto.getNombre());
        p.setDescripcion(dto.getDescripcion());
        p.setImagen(dto.getImagen());
        p.setCategoria(dto.getCategoria());
        return toDTO(productoRepository.save(p));
    }

    public void eliminar(Long id) {
        buscarOLanzar(id);
        productoRepository.deleteById(id);
    }

    // ── Helpers privados ──────────────────────────────────────
    private Producto buscarOLanzar(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + id));
    }

    private ProductoDTO toDTO(Producto p) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(p.getId());
        dto.setNombre(p.getNombre());
        dto.setDescripcion(p.getDescripcion());
        dto.setImagen(p.getImagen());
        dto.setCategoria(p.getCategoria());
        return dto;
    }

    private Producto toEntity(ProductoDTO dto) {
        Producto p = new Producto();
        p.setNombre(dto.getNombre());
        p.setDescripcion(dto.getDescripcion());
        p.setImagen(dto.getImagen());
        p.setCategoria(dto.getCategoria());
        return p;
    }
}