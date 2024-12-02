package com.viendong.webbanhang.config;

import com.viendong.webbanhang.service.UserService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
        private UserService userService;

        @Bean
        public UserDetailsService userDetailsService() {
                return new UserService();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public DaoAuthenticationProvider authenticationProvider() {
                var auth = new DaoAuthenticationProvider();
                auth.setUserDetailsService(userDetailsService());
                auth.setPasswordEncoder(passwordEncoder());
                return auth;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(@NotNull HttpSecurity http) throws Exception {
                return http
                                .csrf(csrf -> csrf
                                                .ignoringRequestMatchers("/api/**", "/cart/**", "/home/**"))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/styles/**", "/js/**", "/", "/oauth/**", "/register",
                                                                "/error", "/assets/**", "/images/**", "/forgot-password", "/verify-otp", "/logo/**")
                                                .permitAll()
                                                .requestMatchers("/admin/**")
                                                .hasAnyAuthority("ADMIN")
                                                .requestMatchers("/api/**", "/cart/**").permitAll()
                                                .anyRequest().authenticated())
                                .logout(logout -> logout
                                                .logoutUrl("/logout")
                                                .logoutSuccessUrl("/")
                                                .deleteCookies("JSESSIONID")
                                                .invalidateHttpSession(true)
                                                .clearAuthentication(true)
                                                .permitAll())
                                .formLogin(formLogin -> formLogin
                                                .loginPage("/")
                                                .loginProcessingUrl("/login")
                                                .successHandler((request, response, authentication) -> {
                                                        String role = authentication.getAuthorities().stream()
                                                                        .findFirst()
                                                                        .map(grantedAuthority -> grantedAuthority
                                                                                        .getAuthority())
                                                                        .orElse("USER");

                                                        if ("ADMIN".equals(role)) {
                                                                response.sendRedirect("/admin");
                                                        } else {
                                                                response.sendRedirect("/home");
                                                        }
                                                })
                                                .failureUrl("/?error")
                                                .permitAll())
                                .rememberMe(rememberMe -> rememberMe
                                                .key("vanlang")
                                                .rememberMeCookieName("vanlang")
                                                .tokenValiditySeconds(24 * 60 * 60)
                                                .userDetailsService(userDetailsService()))
                                .exceptionHandling(exceptionHandling -> exceptionHandling
                                                .accessDeniedPage("/403"))
                                .sessionManagement(sessionManagement -> sessionManagement
                                                .maximumSessions(1)
                                                .expiredUrl("/"))
                                .httpBasic(httpBasic -> httpBasic
                                                .realmName("vanlang"))
                                .build();
        }
}