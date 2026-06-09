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

    @Override
    public void run(String... args) throws Exception {
        seedClientsAndProjects();
    }

    private void seedClientsAndProjects() {
        // First Client: venkatavamsipemada@gmail.com
        if (!clientRepository.existsByEmail("venkatavamsipemada@gmail.com")) {
            Client client1 = new Client(
                    "Venkata Vamsi", 
                    "venkatavamsipemada@gmail.com", 
                    "+1-555-0100", 
                    "Vamsi Tech Solutions"
            );
            clientRepository.save(client1);

            Project p1 = new Project(
                    "Nexus Core API", 
                    "Development of the primary RESTful API handling core business logic, user management, and data synchronization.", 
                    "Java, Spring Boot, MySQL", 
                    LocalDate.now().plusMonths(2), 
                    client1
            );
            p1.setStatus("In Progress");

            Project p2 = new Project(
                    "Mobile App Analytics", 
                    "Integration of custom analytics tracking for the iOS and Android applications.", 
                    "React Native, Firebase", 
                    LocalDate.now().minusDays(10), 
                    client1
            );
            p2.setStatus("Completed");

            projectRepository.saveAll(Arrays.asList(p1, p2));
            System.out.println("Seeded Client 1 and Projects.");
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

            Project p3 = new Project(
                    "E-Commerce Portal", 
                    "Building a highly scalable e-commerce storefront with real-time inventory management.", 
                    "React, Node.js, MongoDB", 
                    LocalDate.now().plusMonths(4), 
                    client2
            );
            p3.setStatus("In Progress");

            Project p4 = new Project(
                    "Legacy System Migration", 
                    "Migrating the 10-year-old on-premise monolithic system to a modern microservices architecture on AWS.", 
                    "AWS, Docker, Kubernetes, Java", 
                    LocalDate.now().plusMonths(6), 
                    client2
            );
            p4.setStatus("Pending");

            projectRepository.saveAll(Arrays.asList(p3, p4));
            
            backend.model.SupportRequest req1 = new backend.model.SupportRequest(
                    "Feature Enhancement", 
                    "We need to add a new payment gateway integration to the E-Commerce Portal.", 
                    client2, p3);
            
            backend.model.SupportRequest req2 = new backend.model.SupportRequest(
                    "Bug Fix", 
                    "The legacy data migration script is throwing an OutOfMemoryError on large datasets.", 
                    client2, p4);

            supportRequestRepository.saveAll(Arrays.asList(req1, req2));

            System.out.println("Seeded Client 2, Projects, and Support Requests.");
        }
    }
}
