package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EducationPlaceTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EducationPlace.class);
        EducationPlace educationPlace1 = new EducationPlace();
        educationPlace1.setId(1L);
        EducationPlace educationPlace2 = new EducationPlace();
        educationPlace2.setId(educationPlace1.getId());
        assertThat(educationPlace1).isEqualTo(educationPlace2);
        educationPlace2.setId(2L);
        assertThat(educationPlace1).isNotEqualTo(educationPlace2);
        educationPlace1.setId(null);
        assertThat(educationPlace1).isNotEqualTo(educationPlace2);
    }
}
