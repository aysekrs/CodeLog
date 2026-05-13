package com.codelog.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;

@Configuration
@EnableWebSecurity // Hocam guvenlik ayarlarini aktif etmek icin ekledim
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // CSRF'i simdilik kapatiyoruz cunku test ederken sorun cikartiyor
        http.csrf(csrf -> csrf.disable());

        http.authorizeHttpRequests(auth -> {
            // Herkesin gorebilecegi sayfalar: Ana sayfa, yazilar, arama ve RSS
            auth.requestMatchers("/", "/api/search/**", "/api/posts/**", "/api/rss/**").permitAll();
            
            // Sadece ADMIN (Yazar) olanlar yorumlari onaylayabilir veya silebilir (Senaryo 4 ve 10)
            auth.requestMatchers("/api/admin/**", "/api/comments/approve/**").hasRole("ADMIN");
            
            // Yorum yapma ve begeni islemleri icin giris yapmis olmak lazim (Senaryo 2 ve 8)
            auth.requestMatchers("/api/comments/**", "/api/posts/*/like").authenticated();
            
            // Diger her sey icin giris sarti koyduk
            auth.anyRequest().authenticated();
        });

        // Test asamasinda kolaylik olsun diye standart giris formunu acik birakiyorum
        http.formLogin(Customizer.withDefaults());
        http.httpBasic(Customizer.withDefaults());

        return http.build();
    }
}