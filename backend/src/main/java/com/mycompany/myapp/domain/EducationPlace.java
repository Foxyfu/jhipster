package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;

/**
 * A EducationPlace.
 */
@Entity
@Table(name = "education_place")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EducationPlace implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "place_name", nullable = false)
    private String placeName;

    @Column(name = "city")
    private String city;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EducationPlace id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlaceName() {
        return this.placeName;
    }

    public EducationPlace placeName(String placeName) {
        this.setPlaceName(placeName);
        return this;
    }

    public void setPlaceName(String placeName) {
        this.placeName = placeName;
    }

    public String getCity() {
        return this.city;
    }

    public EducationPlace city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EducationPlace)) {
            return false;
        }
        return getId() != null && getId().equals(((EducationPlace) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EducationPlace{" +
            "id=" + getId() +
            ", placeName='" + getPlaceName() + "'" +
            ", city='" + getCity() + "'" +
            "}";
    }
}
