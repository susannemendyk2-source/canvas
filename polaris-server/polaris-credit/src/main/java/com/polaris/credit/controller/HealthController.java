package com.polaris.credit;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController("creditHealthController")
public class HealthController {
    @GetMapping("/api/credit/health")
    public String health() {
        return "OK";
    }
}
