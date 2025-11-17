package org.example.tecwebloja;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class TecWebLojaApplication {

    public static void main(String[] args) {
        SpringApplication.run(TecWebLojaApplication.class, args);
    }

}
