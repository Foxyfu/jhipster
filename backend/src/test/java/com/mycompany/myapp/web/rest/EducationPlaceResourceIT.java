package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.EducationPlace;
import com.mycompany.myapp.repository.EducationPlaceRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link EducationPlaceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EducationPlaceResourceIT {

    private static final String DEFAULT_PLACE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PLACE_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CITY = "AAAAAAAAAA";
    private static final String UPDATED_CITY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/education-places";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EducationPlaceRepository educationPlaceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEducationPlaceMockMvc;

    private EducationPlace educationPlace;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EducationPlace createEntity(EntityManager em) {
        EducationPlace educationPlace = new EducationPlace().placeName(DEFAULT_PLACE_NAME).city(DEFAULT_CITY);
        return educationPlace;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EducationPlace createUpdatedEntity(EntityManager em) {
        EducationPlace educationPlace = new EducationPlace().placeName(UPDATED_PLACE_NAME).city(UPDATED_CITY);
        return educationPlace;
    }

    @BeforeEach
    public void initTest() {
        educationPlace = createEntity(em);
    }

    @Test
    @Transactional
    void createEducationPlace() throws Exception {
        int databaseSizeBeforeCreate = educationPlaceRepository.findAll().size();
        // Create the EducationPlace
        restEducationPlaceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educationPlace))
            )
            .andExpect(status().isCreated());

        // Validate the EducationPlace in the database
        List<EducationPlace> educationPlaceList = educationPlaceRepository.findAll();
        assertThat(educationPlaceList).hasSize(databaseSizeBeforeCreate + 1);
        EducationPlace testEducationPlace = educationPlaceList.get(educationPlaceList.size() - 1);
        assertThat(testEducationPlace.getPlaceName()).isEqualTo(DEFAULT_PLACE_NAME);
        assertThat(testEducationPlace.getCity()).isEqualTo(DEFAULT_CITY);
    }

    @Test
    @Transactional
    void createEducationPlaceWithExistingId() throws Exception {
        // Create the EducationPlace with an existing ID
        educationPlace.setId(1L);

        int databaseSizeBeforeCreate = educationPlaceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEducationPlaceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educationPlace))
            )
            .andExpect(status().isBadRequest());

        // Validate the EducationPlace in the database
        List<EducationPlace> educationPlaceList = educationPlaceRepository.findAll();
        assertThat(educationPlaceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkPlaceNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = educationPlaceRepository.findAll().size();
        // set the field null
        educationPlace.setPlaceName(null);

        // Create the EducationPlace, which fails.

        restEducationPlaceMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educationPlace))
            )
            .andExpect(status().isBadRequest());

        List<EducationPlace> educationPlaceList = educationPlaceRepository.findAll();
        assertThat(educationPlaceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEducationPlaces() throws Exception {
        // Initialize the database
        educationPlaceRepository.saveAndFlush(educationPlace);

        // Get all the educationPlaceList
        restEducationPlaceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(educationPlace.getId().intValue())))
            .andExpect(jsonPath("$.[*].placeName").value(hasItem(DEFAULT_PLACE_NAME)))
            .andExpect(jsonPath("$.[*].city").value(hasItem(DEFAULT_CITY)));
    }

    @Test
    @Transactional
    void getEducationPlace() throws Exception {
        // Initialize the database
        educationPlaceRepository.saveAndFlush(educationPlace);

        // Get the educationPlace
        restEducationPlaceMockMvc
            .perform(get(ENTITY_API_URL_ID, educationPlace.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(educationPlace.getId().intValue()))
            .andExpect(jsonPath("$.placeName").value(DEFAULT_PLACE_NAME))
            .andExpect(jsonPath("$.city").value(DEFAULT_CITY));
    }

    @Test
    @Transactional
    void getNonExistingEducationPlace() throws Exception {
        // Get the educationPlace
        restEducationPlaceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEducationPlace() throws Exception {
        // Initialize the database
        educationPlaceRepository.saveAndFlush(educationPlace);

        int databaseSizeBeforeUpdate = educationPlaceRepository.findAll().size();

        // Update the educationPlace
        EducationPlace updatedEducationPlace = educationPlaceRepository.findById(educationPlace.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEducationPlace are not directly saved in db
        em.detach(updatedEducationPlace);
        updatedEducationPlace.placeName(UPDATED_PLACE_NAME).city(UPDATED_CITY);

        restEducationPlaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEducationPlace.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEducationPlace))
            )
            .andExpect(status().isOk());

        // Validate the EducationPlace in the database
        List<EducationPlace> educationPlaceList = educationPlaceRepository.findAll();
        assertThat(educationPlaceList).hasSize(databaseSizeBeforeUpdate);
        EducationPlace testEducationPlace = educationPlaceList.get(educationPlaceList.size() - 1);
        assertThat(testEducationPlace.getPlaceName()).isEqualTo(UPDATED_PLACE_NAME);
        assertThat(testEducationPlace.getCity()).isEqualTo(UPDATED_CITY);
    }

    @Test
    @Transactional
    void putNonExistingEducationPlace() throws Exception {
        int databaseSizeBeforeUpdate = educationPlaceRepository.findAll().size();
        educationPlace.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEducationPlaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, educationPlace.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(educationPlace))
            )
            .andExpect(status().isBadRequest());

        // Validate the EducationPlace in the database
        List<EducationPlace> educationPlaceList = educationPlaceRepository.findAll();
        assertThat(educationPlaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEducationPlace() throws Exception {
        int databaseSizeBeforeUpdate = educationPlaceRepository.findAll().size();
        educationPlace.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducationPlaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(educationPlace))
            )
            .andExpect(status().isBadRequest());

        // Validate the EducationPlace in the database
        List<EducationPlace> educationPlaceList = educationPlaceRepository.findAll();
        assertThat(educationPlaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEducationPlace() throws Exception {
        int databaseSizeBeforeUpdate = educationPlaceRepository.findAll().size();
        educationPlace.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducationPlaceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(educationPlace)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the EducationPlace in the database
        List<EducationPlace> educationPlaceList = educationPlaceRepository.findAll();
        assertThat(educationPlaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEducationPlaceWithPatch() throws Exception {
        // Initialize the database
        educationPlaceRepository.saveAndFlush(educationPlace);

        int databaseSizeBeforeUpdate = educationPlaceRepository.findAll().size();

        // Update the educationPlace using partial update
        EducationPlace partialUpdatedEducationPlace = new EducationPlace();
        partialUpdatedEducationPlace.setId(educationPlace.getId());

        restEducationPlaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEducationPlace.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEducationPlace))
            )
            .andExpect(status().isOk());

        // Validate the EducationPlace in the database
        List<EducationPlace> educationPlaceList = educationPlaceRepository.findAll();
        assertThat(educationPlaceList).hasSize(databaseSizeBeforeUpdate);
        EducationPlace testEducationPlace = educationPlaceList.get(educationPlaceList.size() - 1);
        assertThat(testEducationPlace.getPlaceName()).isEqualTo(DEFAULT_PLACE_NAME);
        assertThat(testEducationPlace.getCity()).isEqualTo(DEFAULT_CITY);
    }

    @Test
    @Transactional
    void fullUpdateEducationPlaceWithPatch() throws Exception {
        // Initialize the database
        educationPlaceRepository.saveAndFlush(educationPlace);

        int databaseSizeBeforeUpdate = educationPlaceRepository.findAll().size();

        // Update the educationPlace using partial update
        EducationPlace partialUpdatedEducationPlace = new EducationPlace();
        partialUpdatedEducationPlace.setId(educationPlace.getId());

        partialUpdatedEducationPlace.placeName(UPDATED_PLACE_NAME).city(UPDATED_CITY);

        restEducationPlaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEducationPlace.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEducationPlace))
            )
            .andExpect(status().isOk());

        // Validate the EducationPlace in the database
        List<EducationPlace> educationPlaceList = educationPlaceRepository.findAll();
        assertThat(educationPlaceList).hasSize(databaseSizeBeforeUpdate);
        EducationPlace testEducationPlace = educationPlaceList.get(educationPlaceList.size() - 1);
        assertThat(testEducationPlace.getPlaceName()).isEqualTo(UPDATED_PLACE_NAME);
        assertThat(testEducationPlace.getCity()).isEqualTo(UPDATED_CITY);
    }

    @Test
    @Transactional
    void patchNonExistingEducationPlace() throws Exception {
        int databaseSizeBeforeUpdate = educationPlaceRepository.findAll().size();
        educationPlace.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEducationPlaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, educationPlace.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(educationPlace))
            )
            .andExpect(status().isBadRequest());

        // Validate the EducationPlace in the database
        List<EducationPlace> educationPlaceList = educationPlaceRepository.findAll();
        assertThat(educationPlaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEducationPlace() throws Exception {
        int databaseSizeBeforeUpdate = educationPlaceRepository.findAll().size();
        educationPlace.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducationPlaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(educationPlace))
            )
            .andExpect(status().isBadRequest());

        // Validate the EducationPlace in the database
        List<EducationPlace> educationPlaceList = educationPlaceRepository.findAll();
        assertThat(educationPlaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEducationPlace() throws Exception {
        int databaseSizeBeforeUpdate = educationPlaceRepository.findAll().size();
        educationPlace.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEducationPlaceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(educationPlace))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the EducationPlace in the database
        List<EducationPlace> educationPlaceList = educationPlaceRepository.findAll();
        assertThat(educationPlaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEducationPlace() throws Exception {
        // Initialize the database
        educationPlaceRepository.saveAndFlush(educationPlace);

        int databaseSizeBeforeDelete = educationPlaceRepository.findAll().size();

        // Delete the educationPlace
        restEducationPlaceMockMvc
            .perform(delete(ENTITY_API_URL_ID, educationPlace.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<EducationPlace> educationPlaceList = educationPlaceRepository.findAll();
        assertThat(educationPlaceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
