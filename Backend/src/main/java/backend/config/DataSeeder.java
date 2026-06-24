package backend.config;

import backend.model.User;
import backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin user
        if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
            userRepository.save(User.builder()
                .name("System Admin")
                .email("admin@gmail.com")
                .password(passwordEncoder.encode("1234"))
                .role("ADMIN")
                .build());
            System.out.println("Seeded default Admin user: admin@gmail.com / 1234");
        }

        // Seed shared manager user
        if (userRepository.findByEmail("manager@gmail.com").isEmpty()) {
            userRepository.save(User.builder()
                .name("Manager")
                .email("manager@gmail.com")
                .password(passwordEncoder.encode("1234"))
                .role("MANAGER")
                .build());
            System.out.println("Seeded default Manager user: manager@gmail.com / 1234");
        }

        // Seed Developer user
        if (userRepository.findByEmail("developer@gmail.com").isEmpty()) {
            userRepository.save(User.builder()
                .name("Software Developer")
                .email("developer@gmail.com")
                .password(passwordEncoder.encode("1234"))
                .role("DEVELOPER")
                .build());
            System.out.println("Seeded default Developer user: developer@gmail.com / 1234");
        }
    }
}
