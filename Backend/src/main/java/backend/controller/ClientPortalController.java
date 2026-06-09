package backend.controller;

import backend.model.Client;
import backend.model.Project;
import backend.model.SupportRequest;
import backend.repository.ClientRepository;
import backend.repository.ProjectRepository;
import backend.repository.SupportRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/client")
@CrossOrigin(origins = "*") // Allows React frontend to fetch data
public class ClientPortalController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    // --- Simple Email Login ---
    @PostMapping("/login")
    public ResponseEntity<?> loginClient(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        // Mock authentication for demonstration - just checking if client exists
        // In a real app, we would verify a password/hash and generate a JWT.
        Client client = clientRepository.findAll().stream()
                .filter(c -> c.getEmail().equalsIgnoreCase(email))
                .findFirst()
                .orElse(null);

        if (client != null) {
            return ResponseEntity.ok(client);
        } else {
            return ResponseEntity.status(401).body("Invalid email. Client not found.");
        }
    }

    // --- Fetch Client's Projects ---
    @GetMapping("/{clientId}/projects")
    public ResponseEntity<List<Project>> getClientProjects(@PathVariable Long clientId) {
        return ResponseEntity.ok(projectRepository.findByClientId(clientId));
    }

    // --- Fetch Client's Requests ---
    @GetMapping("/{clientId}/requests")
    public ResponseEntity<List<SupportRequest>> getClientRequests(@PathVariable Long clientId) {
        return ResponseEntity.ok(supportRequestRepository.findByClientId(clientId));
    }

    // --- Submit New Support Request ---
    @PostMapping("/requests")
    public ResponseEntity<?> submitSupportRequest(@RequestBody Map<String, Object> payload) {
        try {
            Long clientId = Long.valueOf(payload.get("clientId").toString());
            Long projectId = Long.valueOf(payload.get("projectId").toString());
            String requestType = payload.get("requestType").toString();
            String description = payload.get("description").toString();

            Client client = clientRepository.findById(clientId).orElse(null);
            Project project = projectRepository.findById(projectId).orElse(null);

            if (client == null || project == null) {
                return ResponseEntity.badRequest().body("Invalid client or project ID.");
            }

            SupportRequest newRequest = new SupportRequest(requestType, description, client, project);
            SupportRequest savedRequest = supportRequestRepository.save(newRequest);

            return ResponseEntity.ok(savedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid request payload.");
        }
    }
}
