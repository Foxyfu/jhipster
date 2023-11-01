package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Practice;
import com.mycompany.myapp.repository.PracticeRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link PracticeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PracticeResourceIT {

    private static final String DEFAULT_COMPANY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_COMPANY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_STUDENT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_STUDENT_NAME = "BBBBBBBBBB";

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_TASKS = "AAAAAAAAAA";
    private static final String UPDATED_TASKS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/practices";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PracticeRepository practiceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPracticeMockMvc;

    private Practice practice;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Practice createEntity(EntityManager em) {
        Practice practice = new Practice()
            .companyName(DEFAULT_COMPANY_NAME)
            .studentName(DEFAULT_STUDENT_NAME)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .tasks(DEFAULT_TASKS);
        return practice;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Practice createUpdatedEntity(EntityManager em) {
        Practice practice = new Practice()
            .companyName(UPDATED_COMPANY_NAME)
            .studentName(UPDATED_STUDENT_NAME)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .tasks(UPDATED_TASKS);
        return practice;
    }

    @BeforeEach
    public void initTest() {
        practice = createEntity(em);
    }

    @Test
    @Transactional
    void createPractice() throws Exception {
        int databaseSizeBeforeCreate = practiceRepository.findAll().size();
        // Create the Practice
        restPracticeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(practice)))
            .andExpect(status().isCreated());

        // Validate the Practice in the database
        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeCreate + 1);
        Practice testPractice = practiceList.get(practiceList.size() - 1);
        assertThat(testPractice.getCompanyName()).isEqualTo(DEFAULT_COMPANY_NAME);
        assertThat(testPractice.getStudentName()).isEqualTo(DEFAULT_STUDENT_NAME);
        assertThat(testPractice.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testPractice.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testPractice.getTasks()).isEqualTo(DEFAULT_TASKS);
    }

    @Test
    @Transactional
    void createPracticeWithExistingId() throws Exception {
        // Create the Practice with an existing ID
        practice.setId(1L);

        int databaseSizeBeforeCreate = practiceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPracticeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(practice)))
            .andExpect(status().isBadRequest());

        // Validate the Practice in the database
        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCompanyNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = practiceRepository.findAll().size();
        // set the field null
        practice.setCompanyName(null);

        // Create the Practice, which fails.

        restPracticeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(practice)))
            .andExpect(status().isBadRequest());

        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStartDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = practiceRepository.findAll().size();
        // set the field null
        practice.setStartDate(null);

        // Create the Practice, which fails.

        restPracticeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(practice)))
            .andExpect(status().isBadRequest());

        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllPractices() throws Exception {
        // Initialize the database
        practiceRepository.saveAndFlush(practice);

        // Get all the practiceList
        restPracticeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(practice.getId().intValue())))
            .andExpect(jsonPath("$.[*].companyName").value(hasItem(DEFAULT_COMPANY_NAME)))
            .andExpect(jsonPath("$.[*].studentName").value(hasItem(DEFAULT_STUDENT_NAME)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].tasks").value(hasItem(DEFAULT_TASKS)));
    }

    @Test
    @Transactional
    void getPractice() throws Exception {
        // Initialize the database
        practiceRepository.saveAndFlush(practice);

        // Get the practice
        restPracticeMockMvc
            .perform(get(ENTITY_API_URL_ID, practice.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(practice.getId().intValue()))
            .andExpect(jsonPath("$.companyName").value(DEFAULT_COMPANY_NAME))
            .andExpect(jsonPath("$.studentName").value(DEFAULT_STUDENT_NAME))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.tasks").value(DEFAULT_TASKS));
    }

    @Test
    @Transactional
    void getNonExistingPractice() throws Exception {
        // Get the practice
        restPracticeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPractice() throws Exception {
        // Initialize the database
        practiceRepository.saveAndFlush(practice);

        int databaseSizeBeforeUpdate = practiceRepository.findAll().size();

        // Update the practice
        Practice updatedPractice = practiceRepository.findById(practice.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedPractice are not directly saved in db
        em.detach(updatedPractice);
        updatedPractice
            .companyName(UPDATED_COMPANY_NAME)
            .studentName(UPDATED_STUDENT_NAME)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .tasks(UPDATED_TASKS);

        restPracticeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPractice.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPractice))
            )
            .andExpect(status().isOk());

        // Validate the Practice in the database
        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeUpdate);
        Practice testPractice = practiceList.get(practiceList.size() - 1);
        assertThat(testPractice.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testPractice.getStudentName()).isEqualTo(UPDATED_STUDENT_NAME);
        assertThat(testPractice.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testPractice.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testPractice.getTasks()).isEqualTo(UPDATED_TASKS);
    }

    @Test
    @Transactional
    void putNonExistingPractice() throws Exception {
        int databaseSizeBeforeUpdate = practiceRepository.findAll().size();
        practice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPracticeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, practice.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(practice))
            )
            .andExpect(status().isBadRequest());

        // Validate the Practice in the database
        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPractice() throws Exception {
        int databaseSizeBeforeUpdate = practiceRepository.findAll().size();
        practice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPracticeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(practice))
            )
            .andExpect(status().isBadRequest());

        // Validate the Practice in the database
        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPractice() throws Exception {
        int databaseSizeBeforeUpdate = practiceRepository.findAll().size();
        practice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPracticeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(practice)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Practice in the database
        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePracticeWithPatch() throws Exception {
        // Initialize the database
        practiceRepository.saveAndFlush(practice);

        int databaseSizeBeforeUpdate = practiceRepository.findAll().size();

        // Update the practice using partial update
        Practice partialUpdatedPractice = new Practice();
        partialUpdatedPractice.setId(practice.getId());

        partialUpdatedPractice
            .companyName(UPDATED_COMPANY_NAME)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .tasks(UPDATED_TASKS);

        restPracticeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPractice.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPractice))
            )
            .andExpect(status().isOk());

        // Validate the Practice in the database
        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeUpdate);
        Practice testPractice = practiceList.get(practiceList.size() - 1);
        assertThat(testPractice.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testPractice.getStudentName()).isEqualTo(DEFAULT_STUDENT_NAME);
        assertThat(testPractice.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testPractice.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testPractice.getTasks()).isEqualTo(UPDATED_TASKS);
    }

    @Test
    @Transactional
    void fullUpdatePracticeWithPatch() throws Exception {
        // Initialize the database
        practiceRepository.saveAndFlush(practice);

        int databaseSizeBeforeUpdate = practiceRepository.findAll().size();

        // Update the practice using partial update
        Practice partialUpdatedPractice = new Practice();
        partialUpdatedPractice.setId(practice.getId());

        partialUpdatedPractice
            .companyName(UPDATED_COMPANY_NAME)
            .studentName(UPDATED_STUDENT_NAME)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .tasks(UPDATED_TASKS);

        restPracticeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPractice.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPractice))
            )
            .andExpect(status().isOk());

        // Validate the Practice in the database
        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeUpdate);
        Practice testPractice = practiceList.get(practiceList.size() - 1);
        assertThat(testPractice.getCompanyName()).isEqualTo(UPDATED_COMPANY_NAME);
        assertThat(testPractice.getStudentName()).isEqualTo(UPDATED_STUDENT_NAME);
        assertThat(testPractice.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testPractice.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testPractice.getTasks()).isEqualTo(UPDATED_TASKS);
    }

    @Test
    @Transactional
    void patchNonExistingPractice() throws Exception {
        int databaseSizeBeforeUpdate = practiceRepository.findAll().size();
        practice.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPracticeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, practice.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(practice))
            )
            .andExpect(status().isBadRequest());

        // Validate the Practice in the database
        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPractice() throws Exception {
        int databaseSizeBeforeUpdate = practiceRepository.findAll().size();
        practice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPracticeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(practice))
            )
            .andExpect(status().isBadRequest());

        // Validate the Practice in the database
        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPractice() throws Exception {
        int databaseSizeBeforeUpdate = practiceRepository.findAll().size();
        practice.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPracticeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(practice)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Practice in the database
        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePractice() throws Exception {
        // Initialize the database
        practiceRepository.saveAndFlush(practice);

        int databaseSizeBeforeDelete = practiceRepository.findAll().size();

        // Delete the practice
        restPracticeMockMvc
            .perform(delete(ENTITY_API_URL_ID, practice.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Practice> practiceList = practiceRepository.findAll();
        assertThat(practiceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
