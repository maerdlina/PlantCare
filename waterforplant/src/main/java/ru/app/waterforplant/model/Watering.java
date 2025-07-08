package ru.app.waterforplant.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "Watering")
public class Watering {
    @Id
    @GeneratedValue
    private Long id;

    @JsonProperty("last_watering")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date lastWatering;

    @ManyToOne
    @JoinColumn(name = "plant_id")
    @JsonBackReference
    private Plant plant;
}
