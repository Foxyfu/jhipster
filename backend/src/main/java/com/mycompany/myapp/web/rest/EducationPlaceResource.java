package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.EducationPlace;
import com.mycompany.myapp.repository.EducationPlaceRepository;
import com.mycompany.myapp.service.EducationPlaceService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.EducationPlace}.
 */
@RestController
@RequestMapping("/api")
public class EducationPlaceResource {

    private final Logger log = LoggerFactory.getLogger(EducationPlaceResource.class);

    private static final String ENTITY_NAME = "educationPlace";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EducationPlaceService educationPlaceService;

    private final EducationPlaceRepository educationPlaceRepository;

    public EducationPlaceResource(EducationPlaceService educationPlaceService, EducationPlaceRepository educationPlaceRepository) {
        this.educationPlaceService = educationPlaceService;
        this.educationPlaceRepository = educationPlaceRepository;
    }

    /**
     * {@code POST  /education-places} : Create a new educationPlace.
     *
     * @param educationPlace the educationPlace to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new educationPlace, or with status {@code 400 (Bad Request)} if the educationPlace has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/education-places")
    public ResponseEntity<EducationPlace> createEducationPlace(@Valid @RequestBody EducationPlace educationPlace)
        throws URISyntaxException {
        log.debug("REST request to save EducationPlace : {}", educationPlace);
        if (educationPlace.getId() != null) {
            throw new BadRequestAlertException("A new educationPlace cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EducationPlace result = educationPlaceService.save(educationPlace);
        return ResponseEntity
            .created(new URI("/api/education-places/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /education-places/:id} : Updates an existing educationPlace.
     *
     * @param id the id of the educationPlace to save.
     * @param educationPlace the educationPlace to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated educationPlace,
     * or with status {@code 400 (Bad Request)} if the educationPlace is not valid,
     * or with status {@code 500 (Internal Server Error)} if the educationPlace couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/education-places/{id}")
    public ResponseEntity<EducationPlace> updateEducationPlace(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EducationPlace educationPlace
    ) throws URISyntaxException {
        log.debug("REST request to update EducationPlace : {}, {}", id, educationPlace);
        if (educationPlace.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, educationPlace.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!educationPlaceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        EducationPlace result = educationPlaceService.update(educationPlace);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, educationPlace.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /education-places/:id} : Partial updates given fields of an existing educationPlace, field will ignore if it is null
     *
     * @param id the id of the educationPlace to save.
     * @param educationPlace the educationPlace to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated educationPlace,
     * or with status {@code 400 (Bad Request)} if the educationPlace is not valid,
     * or with status {@code 404 (Not Found)} if the educationPlace is not found,
     * or with status {@code 500 (Internal Server Error)} if the educationPlace couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/education-places/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EducationPlace> partialUpdateEducationPlace(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EducationPlace educationPlace
    ) throws URISyntaxException {
        log.debug("REST request to partial update EducationPlace partially : {}, {}", id, educationPlace);
        if (educationPlace.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, educationPlace.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!educationPlaceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EducationPlace> result = educationPlaceService.partialUpdate(educationPlace);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, educationPlace.getId().toString())
        );
    }

    /**
     * {@code GET  /education-places} : get all the educationPlaces.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of educationPlaces in body.
     */
    @GetMapping("/education-places")
    public List<EducationPlace> getAllEducationPlaces() {
        log.debug("REST request to get all EducationPlaces");
        return educationPlaceService.findAll();
    }

    /**
     * {@code GET  /education-places/:id} : get the "id" educationPlace.
     *
     * @param id the id of the educationPlace to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the educationPlace, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/education-places/{id}")
    public ResponseEntity<EducationPlace> getEducationPlace(@PathVariable Long id) {
        log.debug("REST request to get EducationPlace : {}", id);
        Optional<EducationPlace> educationPlace = educationPlaceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(educationPlace);
    }

    /**
     * {@code DELETE  /education-places/:id} : delete the "id" educationPlace.
     *
     * @param id the id of the educationPlace to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/education-places/{id}")
    public ResponseEntity<Void> deleteEducationPlace(@PathVariable Long id) {
        log.debug("REST request to delete EducationPlace : {}", id);
        educationPlaceService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
