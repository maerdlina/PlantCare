package ru.app.waterforplant.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import ru.app.waterforplant.model.Plant;
import ru.app.waterforplant.service.PlantService;

import java.util.Date;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"})
@RequestMapping("/plants")
public class PlantController {
    private final PlantService plantService;

    @PostMapping("/addPlant")
    public Plant addPlant(@RequestBody Plant plant){
        return plantService.addPlant(plant);
    }

    @GetMapping("/seePlantByName")
    public Plant seePlantByName(@RequestParam String name){
        return plantService.seePlantByName(name);
    }

    @DeleteMapping("/deleteByName")
    public String deletePlantByName(@RequestParam String name){
        return plantService.deleteByName(name);
    }

    @PutMapping ("/updatePlantByName")
    public Plant updatePlantByName(
            @RequestParam("id") Long id,  // Явно указать имя параметра
            @RequestParam("plant_name") String plantName,
            @RequestParam("plant_type") String plantType,
            @RequestParam("date_of_birth") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateOfBirth
    ){
        return plantService.updatePlant(id, plantName, plantType, dateOfBirth);
    }
}
