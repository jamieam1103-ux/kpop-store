package com.web.kpop_store.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.web.kpop_store.entity.Producto;
import com.web.kpop_store.entity.Variante;
import com.web.kpop_store.repository.ProductoRepository;
import com.web.kpop_store.repository.VarianteRepository;

@Service
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final VarianteRepository varianteRepository;

    public ProductoService(ProductoRepository productoRepository, VarianteRepository varianteRepository) {
        this.productoRepository = productoRepository;
        this.varianteRepository = varianteRepository;
    }

    public List<Producto> listarTodos() { return productoRepository.findAll(); }
    public Producto buscarPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }
    public List<Producto> buscarPorCategoria(String categoria) { return productoRepository.findByCategoria(categoria); }
    public List<Producto> buscarPorNombre(String nombre) { return productoRepository.buscarPorNombre(nombre); }

    public Producto guardar(Producto producto) { return productoRepository.save(producto); }

    public Producto actualizar(Long id, Producto productoNuevo) {
        Producto producto = buscarPorId(id);
        producto.setNombre(productoNuevo.getNombre());
        producto.setDescripcion(productoNuevo.getDescripcion());
        producto.setCategoria(productoNuevo.getCategoria());
        producto.setImagen(productoNuevo.getImagen());
        return productoRepository.save(producto);
    }

    public void eliminar(Long id) { productoRepository.deleteById(id); }
    public List<Variante> stockBajo() { return varianteRepository.findVariantesConStockBajo(); }
}