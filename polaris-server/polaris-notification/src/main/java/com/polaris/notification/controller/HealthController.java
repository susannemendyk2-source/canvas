package com.polaris.notification;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController("notificationHealthController")
public class HealthController {
    @GetMapping("/api/notification/health")
    public String health() {
        return "OK";
    }
}
