package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Practice;
import com.mycompany.myapp.repository.PracticeRepository;
import com.mycompany.myapp.service.PracticeService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.Practice}.
 */
@Service
@Transactional
public class PracticeServiceImpl implements PracticeService {

    private final Logger log = LoggerFactory.getLogger(PracticeServiceImpl.class);

    private final PracticeRepository practiceRepository;

    public PracticeServiceImpl(PracticeRepository practiceRepository) {
        this.practiceRepository = practiceRepository;
    }

    @Override
    public Practice save(Practice practice) {
        log.debug("Request to save Practice : {}", practice);
        return practiceRepository.save(practice);
    }

    @Override
    public Practice update(Practice practice) {
        log.debug("Request to update Practice : {}", practice);
        return practiceRepository.save(practice);
    }

    @Override
    public Optional<Practice> partialUpdate(Practice practice) {
        log.debug("Request to partially update Practice : {}", practice);

        return practiceRepository
            .findById(practice.getId())
            .map(existingPractice -> {
                if (practice.getCompanyName() != null) {
                    existingPractice.setCompanyName(practice.getCompanyName());
                }
                if (practice.getStudentName() != null) {
                    existingPractice.setStudentName(practice.getStudentName());
                }
                if (practice.getStartDate() != null) {
                    existingPractice.setStartDate(practice.getStartDate());
                }
                if (practice.getEndDate() != null) {
                    existingPractice.setEndDate(practice.getEndDate());
                }
                if (practice.getTasks() != null) {
                    existingPractice.setTasks(practice.getTasks());
                }

                return existingPractice;
            })
            .map(practiceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Practice> findAll(Pageable pageable) {
        log.debug("Request to get all Practices");
        return practiceRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Practice> findOne(Long id) {
        log.debug("Request to get Practice : {}", id);
        return practiceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Practice : {}", id);
        practiceRepository.deleteById(id);
    }
}
