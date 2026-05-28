package com.web.kpop_store.repository;

import com.web.kpop_store.entity.Variante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface VarianteRepository extends JpaRepository<Variante, Long> {
    List<Variante> findByProductoId(Long productoId);
    List<Variante> findByStockLessThanEqual(Integer stockMinimo);

    @Query("SELECT v FROM Variante v WHERE v.stock <= v.stockMinimo")
    List<Variante> findVariantesConStockBajo();
}