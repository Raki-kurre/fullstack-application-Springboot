package com.app.config;

import com.app.entity.Product;
import com.app.entity.Role;
import com.app.entity.User;
import com.app.repository.ProductRepository;
import com.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner seedData() {
        return args -> {
            seedUsers();
            seedProducts();
        };
    }

    private void seedUsers() {
        // Admin user
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .provider("LOCAL")
                    .build();
            userRepository.save(admin);
            log.info("Seeded admin user: admin@example.com");
        }

        // Regular user
        if (!userRepository.existsByEmail("user@example.com")) {
            User user = User.builder()
                    .name("Regular User")
                    .email("user@example.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.USER)
                    .provider("LOCAL")
                    .build();
            userRepository.save(user);
            log.info("Seeded regular user: user@example.com");
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            productRepository.save(Product.builder()
                    .name("Wireless Bluetooth Headphones")
                    .description("Premium noise-cancelling headphones with 30-hour battery life and crystal-clear sound.")
                    .price(new BigDecimal("89.99"))
                    .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400")
                    .build());

            productRepository.save(Product.builder()
                    .name("Smart Fitness Tracker")
                    .description("Track your steps, heart rate, sleep, and more with this sleek waterproof fitness band.")
                    .price(new BigDecimal("49.99"))
                    .imageUrl("https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400")
                    .build());

            productRepository.save(Product.builder()
                    .name("Mechanical Keyboard")
                    .description("Compact TKL mechanical keyboard with RGB backlight and tactile blue switches.")
                    .price(new BigDecimal("129.99"))
                    .imageUrl("https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400")
                    .build());

            productRepository.save(Product.builder()
                    .name("USB-C Hub 7-in-1")
                    .description("Expand your laptop's connectivity with HDMI 4K, USB 3.0, SD card, and PD charging.")
                    .price(new BigDecimal("39.99"))
                    .imageUrl("https://images.unsplash.com/photo-1618383535372-5c832e4a3fa5?w=400")
                    .build());

            productRepository.save(Product.builder()
                    .name("Portable SSD 1TB")
                    .description("Ultra-fast 1050MB/s read speed portable SSD with shock-resistant casing.")
                    .price(new BigDecimal("109.99"))
                    .imageUrl("https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400")
                    .build());

            productRepository.save(Product.builder()
                    .name("Webcam 4K Ultra HD")
                    .description("Professional 4K webcam with built-in microphone, autofocus, and low-light correction.")
                    .price(new BigDecimal("79.99"))
                    .imageUrl("https://images.unsplash.com/photo-1617375407361-ebd50dd6e36c?w=400")
                    .build());

            log.info("Seeded 6 sample products");
        }
    }
}
