package ru.app.waterforplant.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.app.waterforplant.model.Plant;

@Repository
public interface PlantsRepo extends JpaRepository<Plant, Long> {
    Plant findPlantById(Long id);
    Plant findPlantByName(String name);
}
