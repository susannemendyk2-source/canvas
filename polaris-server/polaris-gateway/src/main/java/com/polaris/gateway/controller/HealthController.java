package com.polaris.gateway;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController("gatewayHealthController")
public class HealthController {
    @GetMapping("/api/gateway/health")
    public String health() {
        return "OK";
    }
}
