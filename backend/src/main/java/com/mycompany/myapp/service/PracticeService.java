package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Practice;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.Practice}.
 */
public interface PracticeService {
    /**
     * Save a practice.
     *
     * @param practice the entity to save.
     * @return the persisted entity.
     */
    Practice save(Practice practice);

    /**
     * Updates a practice.
     *
     * @param practice the entity to update.
     * @return the persisted entity.
     */
    Practice update(Practice practice);

    /**
     * Partially updates a practice.
     *
     * @param practice the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Practice> partialUpdate(Practice practice);

    /**
     * Get all the practices.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Practice> findAll(Pageable pageable);

    /**
     * Get the "id" practice.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Practice> findOne(Long id);

    /**
     * Delete the "id" practice.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
