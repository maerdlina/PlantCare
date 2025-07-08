package ru.app.waterforplant.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "Plants")
public class Plant {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @JsonProperty("plant_name")
    private String name;

    @JsonProperty("plant_type")
    private String Type;

    @JsonProperty("date_of_birth")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date dateOfBirth;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "plant", orphanRemoval = true)
    private List<Watering> wateringTimes = new ArrayList<>();
}
