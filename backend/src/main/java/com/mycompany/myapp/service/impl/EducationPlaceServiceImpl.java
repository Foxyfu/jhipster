package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.EducationPlace;
import com.mycompany.myapp.repository.EducationPlaceRepository;
import com.mycompany.myapp.service.EducationPlaceService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.mycompany.myapp.domain.EducationPlace}.
 */
@Service
@Transactional
public class EducationPlaceServiceImpl implements EducationPlaceService {

    private final Logger log = LoggerFactory.getLogger(EducationPlaceServiceImpl.class);

    private final EducationPlaceRepository educationPlaceRepository;

    public EducationPlaceServiceImpl(EducationPlaceRepository educationPlaceRepository) {
        this.educationPlaceRepository = educationPlaceRepository;
    }

    @Override
    public EducationPlace save(EducationPlace educationPlace) {
        log.debug("Request to save EducationPlace : {}", educationPlace);
        return educationPlaceRepository.save(educationPlace);
    }

    @Override
    public EducationPlace update(EducationPlace educationPlace) {
        log.debug("Request to update EducationPlace : {}", educationPlace);
        return educationPlaceRepository.save(educationPlace);
    }

    @Override
    public Optional<EducationPlace> partialUpdate(EducationPlace educationPlace) {
        log.debug("Request to partially update EducationPlace : {}", educationPlace);

        return educationPlaceRepository
            .findById(educationPlace.getId())
            .map(existingEducationPlace -> {
                if (educationPlace.getPlaceName() != null) {
                    existingEducationPlace.setPlaceName(educationPlace.getPlaceName());
                }
                if (educationPlace.getCity() != null) {
                    existingEducationPlace.setCity(educationPlace.getCity());
                }

                return existingEducationPlace;
            })
            .map(educationPlaceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EducationPlace> findAll() {
        log.debug("Request to get all EducationPlaces");
        return educationPlaceRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EducationPlace> findOne(Long id) {
        log.debug("Request to get EducationPlace : {}", id);
        return educationPlaceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete EducationPlace : {}", id);
        educationPlaceRepository.deleteById(id);
    }
}
