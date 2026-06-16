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

        // Seed 5 Manager accounts
        String[][] managers = {
            {"Manager 1", "manager1@nexus.com"},
            {"Manager 2", "manager2@nexus.com"},
            {"Manager 3", "manager3@nexus.com"},
            {"Manager 4", "manager4@nexus.com"},
            {"Manager 5", "manager5@nexus.com"}
        };
        for (String[] m : managers) {
            if (userRepository.findByEmail(m[1]).isEmpty()) {
                userRepository.save(User.builder()
                    .name(m[0])
                    .email(m[1])
                    .password(passwordEncoder.encode("1234"))
                    .role("MANAGER")
                    .build());
                System.out.println("Seeded manager: " + m[1] + " / 1234");
            }
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
