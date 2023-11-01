package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Practice;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Practice entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PracticeRepository extends JpaRepository<Practice, Long> {}
