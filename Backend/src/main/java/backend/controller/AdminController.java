package backend.controller;

import backend.model.Client;
import backend.model.Project;
import backend.repository.ClientRepository;
import backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*") // Allows React frontend to fetch data
public class AdminController {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private backend.repository.SupportRequestRepository supportRequestRepository;

    @Autowired
    private backend.repository.UserRepository userRepository;

    // --- Dashboard Overview Endpoint ---
    @GetMapping("/dashboard/overview")
    public ResponseEntity<Map<String, Object>> getDashboardOverview() {
        Map<String, Object> response = new HashMap<>();
        
        long totalClients = clientRepository.count();
        long activeProjects = projectRepository.findByStatus("In Progress").size();
        long totalProjects = projectRepository.count();
        long pendingProjects = projectRepository.findByStatus("Pending").size();
        
        long activeClients = projectRepository.findByStatus("In Progress").stream()
                .map(backend.model.Project::getClient)
                .filter(java.util.Objects::nonNull)
                .map(backend.model.Client::getId)
                .distinct()
                .count();

        long activeRequests = supportRequestRepository.findByStatus("Accepted").size();
        long pendingRequests = supportRequestRepository.findByStatus("Pending").size();

        // High-level stats
        response.put("totalClients", totalClients);
        response.put("activeClients", activeClients);
        response.put("activeProjects", activeProjects);
        response.put("totalProjects", totalProjects);
        response.put("pendingProjects", pendingProjects);
        response.put("activeRequests", activeRequests);
        response.put("pendingRequests", pendingRequests);

        response.put("recentProjects", projectRepository.findAll());

        // Recent service/maintenance requests (latest 10, newest first)
        List<backend.model.SupportRequest> allRequests = supportRequestRepository.findAll();
        allRequests.sort((a, b) -> {
            if (a.getSubmittedAt() == null && b.getSubmittedAt() == null) return 0;
            if (a.getSubmittedAt() == null) return 1;
            if (b.getSubmittedAt() == null) return -1;
            return b.getSubmittedAt().compareTo(a.getSubmittedAt());
        });
        List<backend.model.SupportRequest> recentRequests = allRequests.stream()
                .limit(10)
                .collect(java.util.stream.Collectors.toList());
        response.put("recentRequests", recentRequests);

        return ResponseEntity.ok(response);
    }

    // --- Support Requests Endpoints ---
    @GetMapping("/requests/pending")
    public ResponseEntity<List<backend.model.SupportRequest>> getPendingRequests() {
        return ResponseEntity.ok(supportRequestRepository.findByStatus("Pending"));
    }

    @PutMapping("/requests/{id}/status")
    public ResponseEntity<backend.model.SupportRequest> updateRequestStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        return supportRequestRepository.findById(id).map(request -> {
            if (payload.containsKey("status")) {
                request.setStatus(payload.get("status"));
            }
            if (payload.containsKey("assignedManager")) {
                request.setAssignedManager(payload.get("assignedManager"));
            }
            return ResponseEntity.ok(supportRequestRepository.save(request));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/requests/active")
    public ResponseEntity<List<backend.model.SupportRequest>> getActiveRequests() {
        return ResponseEntity.ok(supportRequestRepository.findByStatus("Accepted"));
    }

    @GetMapping("/requests/history")
    public ResponseEntity<List<backend.model.SupportRequest>> getClosedRequests() {
        List<backend.model.SupportRequest> accepted = supportRequestRepository.findByStatus("Accepted");
        List<backend.model.SupportRequest> rejected = supportRequestRepository.findByStatus("Rejected");
        List<backend.model.SupportRequest> combined = new java.util.ArrayList<>();
        combined.addAll(accepted);
        combined.addAll(rejected);
        return ResponseEntity.ok(combined);
    }

    // --- Managers Endpoint ---
    @GetMapping("/managers")
    public ResponseEntity<List<Map<String, Object>>> getManagers() {
        List<Map<String, Object>> virtualManagers = new java.util.ArrayList<>();
        String[] managerNames = {"manager1", "manager2", "manager3", "manager4", "manager5"};
        long idCounter = 1000;
        for (String name : managerNames) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", idCounter++);
            map.put("name", name);
            map.put("email", "manager@gmail.com"); // Shared login
            map.put("role", "MANAGER");
            virtualManagers.add(map);
        }
        return ResponseEntity.ok(virtualManagers);
    }

    // --- Manager Workload Endpoint ---
    @GetMapping("/managers/workload")
    public ResponseEntity<List<Map<String, Object>>> getManagerWorkload() {
        List<backend.model.SupportRequest> activeReqs = supportRequestRepository.findByStatus("Accepted");

        List<Map<String, Object>> result = new java.util.ArrayList<>();
        String[] managerNames = {"manager1", "manager2", "manager3", "manager4", "manager5"};
        long idCounter = 1000;
        
        for (String managerName : managerNames) {
            long count = 0;
            for (backend.model.SupportRequest req : activeReqs) {
                if (managerName.equalsIgnoreCase(req.getAssignedManager())) {
                    count++;
                }
            }
            Map<String, Object> entry = new HashMap<>();
            entry.put("id", idCounter++);
            entry.put("name", managerName);
            entry.put("email", "manager@gmail.com");
            entry.put("activeRequests", count);
            result.add(entry);
        }
        // Sort ascending by workload (least loaded first)
        result.sort((a, b) -> Long.compare((Long) a.get("activeRequests"), (Long) b.get("activeRequests")));
        return ResponseEntity.ok(result);
    }

    // --- Clients Endpoints ---
    @GetMapping("/clients")
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientRepository.findAll());
    }

    @PostMapping("/clients")
    public ResponseEntity<Client> createClient(@RequestBody Client client) {
        return ResponseEntity.ok(clientRepository.save(client));
    }

    // --- Projects Endpoints ---
    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectRepository.findAll());
    }

    @PostMapping("/projects")
    public ResponseEntity<?> createProject(@RequestBody Map<String, Object> payload) {
        try {
            String projectName = (String) payload.get("projectName");
            String description = (String) payload.get("description");
            String technologyStack = (String) payload.get("technologyStack");
            String status = (String) payload.get("status");
            String githubUrl = (String) payload.get("githubUrl");
            String assignedManager = (String) payload.get("assignedManager");
            Double price = payload.get("price") != null ? Double.valueOf(payload.get("price").toString()) : null;
            java.time.LocalDate deliveryDate = payload.get("deliveryDate") != null ? java.time.LocalDate.parse((String) payload.get("deliveryDate")) : null;

            String clientName = (String) payload.get("clientName");
            String clientEmail = (String) payload.get("clientEmail");

            if (clientEmail == null || clientEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Client email is required.");
            }

            // Find or create Client by email
            Client client = clientRepository.findAll().stream()
                    .filter(c -> c.getEmail().equalsIgnoreCase(clientEmail))
                    .findFirst()
                    .orElse(null);

            if (client == null) {
                client = new Client();
                client.setName(clientName != null ? clientName : "Client");
                client.setEmail(clientEmail);
                client.setCompanyName("Company Client");
                client = clientRepository.save(client);
            } else if (clientName != null && !clientName.trim().isEmpty()) {
                client.setName(clientName);
                client = clientRepository.save(client);
            }

            Project project = new Project();
            project.setProjectName(projectName);
            project.setDescription(description);
            project.setTechnologyStack(technologyStack);
            project.setDeliveryDate(deliveryDate);
            project.setStatus(status != null ? status : "Completed");
            project.setDeploymentUrl("");
            project.setGithubUrl(githubUrl);
            project.setPrice(price);
            project.setAssignedManager(assignedManager);
            project.setClient(client);

            return ResponseEntity.ok(projectRepository.save(project));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process project creation: " + e.getMessage());
        }
    }
}
