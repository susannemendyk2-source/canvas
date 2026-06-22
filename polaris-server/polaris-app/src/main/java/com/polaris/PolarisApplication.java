package com.polaris;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.polaris")
public class PolarisApplication {
    public static void main(String[] args) {
        SpringApplication.run(PolarisApplication.class, args);
    }
}
