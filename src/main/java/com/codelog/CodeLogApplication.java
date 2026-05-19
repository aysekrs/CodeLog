package com.codelog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Kök modüldeki eski CodeLog sunucusu (RSS, arama, yorum vb.).
 * <p><b>React yazı paneli ve JWT blog API için ana giriş:</b>
 * {@code com.nazli.blog.BlogBackendApplication} — {@code backend/} modülü, varsayılan port {@code 8080}.
 * Bu sınıf varsayılan olarak {@code 8081} portunda çalışır ({@code src/main/resources/application.properties}),
 * böylece iki uygulama aynı makinede çakışmadan çalışabilir.
 */
@SpringBootApplication
public class CodeLogApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodeLogApplication.class, args);
    }
}
