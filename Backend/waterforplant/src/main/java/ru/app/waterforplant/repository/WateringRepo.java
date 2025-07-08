package ru.app.waterforplant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.app.waterforplant.model.Watering;

public interface WateringRepo extends JpaRepository<Watering, Long> {
    Watering findWateringById(Long id);
}