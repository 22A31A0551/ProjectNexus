package backend.config;

import backend.model.Client;
import backend.model.Project;
import backend.repository.ClientRepository;
import backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private backend.repository.SupportRequestRepository supportRequestRepository;

    @Autowired
    private backend.repository.UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedClients();
        seedDevelopers();
        seedManagers();
    }

    private void seedClients() {
        // First Client: venkatavamsipemada@gmail.com
        if (!clientRepository.existsByEmail("venkatavamsipemada@gmail.com")) {
            Client client1 = new Client(
                    "Venkata Vamsi", 
                    "venkatavamsipemada@gmail.com", 
                    "+1-555-0100", 
                    "Vamsi Tech Solutions"
            );
            clientRepository.save(client1);
            System.out.println("Restored Client 1.");
        }

        // Second Client: pemmada2@gmail.com
        if (!clientRepository.existsByEmail("pemmada2@gmail.com")) {
            Client client2 = new Client(
                    "Pemmada", 
                    "pemmada2@gmail.com", 
                    "+1-555-0200", 
                    "Global Innovations Inc"
            );
            clientRepository.save(client2);
            System.out.println("Restored Client 2.");
        }
    }

    private void seedDevelopers() {
        String[][] devData = {
            {"Kiran Kumar", "kiran@projectnexus.com", "React, Node.js"},
            {"Divya Rao", "divya@projectnexus.com", "Java, Spring Boot"},
            {"Sai Teja", "sai@projectnexus.com", "Python, ML"},
            {"Lakshmi Naidu", "lakshmi@projectnexus.com", "QA, Selenium"},
            {"Venkat Raju", "venkat@projectnexus.com", "AWS, DevOps"}
        };
        String defaultPass = passwordEncoder.encode("1234");

        for (String[] dev : devData) {
            if (userRepository.findByEmail(dev[1]).isEmpty()) {
                backend.model.User devUser = backend.model.User.builder()
                        .name(dev[0])
                        .email(dev[1])
                        .password(defaultPass)
                        .role("DEVELOPER")
                        .skills(dev[2])
                        .build();
                userRepository.save(devUser);
                System.out.println("Seeded developer: " + dev[0]);
            }
        }
    }

    private void seedManagers() {
        String[] managerNames = {"manager1", "manager2", "manager3", "manager4", "manager5"};
        String defaultPass = passwordEncoder.encode("1234");

        for (String name : managerNames) {
            String email = name + "@gmail.com";
            if (userRepository.findByEmail(email).isEmpty()) {
                backend.model.User mgrUser = backend.model.User.builder()
                        .name(name)
                        .email(email)
                        .password(defaultPass)
                        .role("MANAGER")
                        .build();
                userRepository.save(mgrUser);
                System.out.println("Seeded manager: " + name);
            }
        }
    }
}
