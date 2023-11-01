package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.EducationPlace;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.mycompany.myapp.domain.EducationPlace}.
 */
public interface EducationPlaceService {
    /**
     * Save a educationPlace.
     *
     * @param educationPlace the entity to save.
     * @return the persisted entity.
     */
    EducationPlace save(EducationPlace educationPlace);

    /**
     * Updates a educationPlace.
     *
     * @param educationPlace the entity to update.
     * @return the persisted entity.
     */
    EducationPlace update(EducationPlace educationPlace);

    /**
     * Partially updates a educationPlace.
     *
     * @param educationPlace the entity to update partially.
     * @return the persisted entity.
     */
    Optional<EducationPlace> partialUpdate(EducationPlace educationPlace);

    /**
     * Get all the educationPlaces.
     *
     * @return the list of entities.
     */
    List<EducationPlace> findAll();

    /**
     * Get the "id" educationPlace.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<EducationPlace> findOne(Long id);

    /**
     * Delete the "id" educationPlace.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
