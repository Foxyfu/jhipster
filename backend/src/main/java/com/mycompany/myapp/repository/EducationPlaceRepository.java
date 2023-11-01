package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.EducationPlace;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the EducationPlace entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EducationPlaceRepository extends JpaRepository<EducationPlace, Long> {}
