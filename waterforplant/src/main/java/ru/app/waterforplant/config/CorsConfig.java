package ru.app.waterforplant.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(
                        "http://127.0.0.1:5500",
                        "http://localhost:5500",
                        "https://*.*.ngrok-free.app",
                        "https://*.ngrok.io",
                        "https://*.ngrok-free.app",
                        "https://d6963bb7b7b3.ngrok-free.app"
                        )
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}