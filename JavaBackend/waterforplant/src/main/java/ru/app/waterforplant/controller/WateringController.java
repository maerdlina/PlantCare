package ru.app.waterforplant.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ru.app.waterforplant.model.Watering;
import ru.app.waterforplant.service.WateringService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/watering")
public class WateringController {
    private final WateringService wateringService;
    @PostMapping("/addWateringTime")
    public Watering addWatering(@RequestBody Watering watering, @RequestParam Long id){
        return wateringService.addWatering(watering, id);
    }
}
