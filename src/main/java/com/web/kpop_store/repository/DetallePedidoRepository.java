package com.web.kpop_store.repository;

import com.web.kpop_store.entity.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Long> {

    @Query("SELECT d.variante.producto.nombre, SUM(d.cantidad) as total " +
            "FROM DetallePedido d GROUP BY d.variante.producto.nombre " +
            "ORDER BY total DESC")
    List<Object[]> findTopProductos();

    @Query("SELECT SUM(d.precioUnitario * d.cantidad) FROM DetallePedido d " +
            "WHERE d.pedido.fecha >= :desde AND d.pedido.estado = 'PAGADO'")
    Double sumVentasDesde(@Param("desde") LocalDateTime desde);
}