package com.polaris.admin;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController("adminHealthController")
public class HealthController {
    @GetMapping("/api/admin/health")
    public String health() {
        return "OK";
    }
}
