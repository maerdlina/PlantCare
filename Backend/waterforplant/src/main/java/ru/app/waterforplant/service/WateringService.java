package ru.app.waterforplant.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.app.waterforplant.model.Plant;
import ru.app.waterforplant.model.Watering;
import ru.app.waterforplant.repository.PlantsRepo;
import ru.app.waterforplant.repository.WateringRepo;

@Service
@RequiredArgsConstructor
public class WateringService {
    private final WateringRepo wateringRepo;
    private final PlantsRepo plantsRepo;
    public Watering addWatering(Watering watering, Long id) {
        Plant plant = plantsRepo.findPlantById(id);
        watering.setPlant(plant);
        return wateringRepo.save(watering);
    }
}
