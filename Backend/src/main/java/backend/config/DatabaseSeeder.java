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
        seedClients();
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
}
