package com.polaris.ai.task;

import org.springframework.stereotype.Component;

@Component
public class AiGenerationTask {

    public void processGeneration(Long taskId, String type, String prompt) {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
