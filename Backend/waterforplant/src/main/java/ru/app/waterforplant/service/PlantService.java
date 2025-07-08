package ru.app.waterforplant.service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.app.waterforplant.model.Plant;
import ru.app.waterforplant.repository.PlantsRepo;

import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PlantService {
    private final PlantsRepo plantsRepo;
    public Plant addPlant(Plant plant){
        return plantsRepo.save(plant);
    }

    public List<Plant> allPlant(){
        return plantsRepo.findAll();
    }
    public Plant seePlantByName(String name){
        return plantsRepo.findPlantByName(name);
    }

    @Transactional
    public String deleteByName(String name){
        Long id = plantsRepo.findPlantByName(name).getId();
        plantsRepo.deleteById(id);
        return "Delete plant";
    }

    public Plant updatePlant(Long id, String name, String type, Date dateOfBirth){
        Plant plant = plantsRepo.findPlantById(id);
        plant.setId(id);
        plant.setName(name);
        plant.setType(type);
        plant.setDateOfBirth(dateOfBirth);
        return plantsRepo.save(plant);
    }
}
