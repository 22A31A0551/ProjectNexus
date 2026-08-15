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

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

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
        return ResponseEntity.ok(supportRequestRepository.findByStatus("Closed"));
    }

    // --- Managers Endpoint ---
    @GetMapping("/managers")
    public ResponseEntity<List<Map<String, Object>>> getManagers() {
        List<backend.model.User> managers = userRepository.findByRole("MANAGER");
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        for (backend.model.User mgr : managers) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", mgr.getId());
            map.put("name", mgr.getName());
            map.put("email", mgr.getEmail());
            map.put("role", mgr.getRole());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    // --- Manager Workload Endpoint ---
    @GetMapping("/managers/workload")
    public ResponseEntity<List<Map<String, Object>>> getManagerWorkload() {
        List<backend.model.SupportRequest> activeReqs = supportRequestRepository.findByStatus("Accepted");
        List<backend.model.User> managers = userRepository.findByRole("MANAGER");
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        
        for (backend.model.User mgr : managers) {
            long count = 0;
            for (backend.model.SupportRequest req : activeReqs) {
                if (mgr.getName() != null && mgr.getName().equalsIgnoreCase(req.getAssignedManager())) {
                    count++;
                }
            }
            Map<String, Object> entry = new HashMap<>();
            entry.put("id", mgr.getId());
            entry.put("name", mgr.getName());
            entry.put("email", mgr.getEmail());
            entry.put("activeRequests", count);
            result.add(entry);
        }
        // Sort ascending by workload (least loaded first)
        result.sort((a, b) -> Long.compare((Long) a.get("activeRequests"), (Long) b.get("activeRequests")));
        return ResponseEntity.ok(result);
    }

    // --- Developers Endpoints ---
    @GetMapping("/developers")
    public ResponseEntity<List<backend.model.User>> getDevelopers() {
        return ResponseEntity.ok(userRepository.findByRole("DEVELOPER"));
    }

    @PostMapping("/developers")
    public ResponseEntity<?> createDeveloper(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String password = payload.get("password");
        String skills = payload.get("skills");

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email and password are required.");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("User with this email already exists.");
        }

        backend.model.User devUser = backend.model.User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role("DEVELOPER")
                .skills(skills)
                .build();

        return ResponseEntity.ok(userRepository.save(devUser));
    }

    // --- Create Manager Endpoint ---
    @PostMapping("/managers")
    public ResponseEntity<?> createManager(@RequestBody Map<String, String> payload) {
        String name = payload.get("name");
        String email = payload.get("email");
        String password = payload.get("password");

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email and password are required.");
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("User with this email already exists.");
        }

        backend.model.User mgrUser = backend.model.User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role("MANAGER")
                .build();

        return ResponseEntity.ok(userRepository.save(mgrUser));
    }

    // --- Client Detail Endpoint (for admin view) ---
    @GetMapping("/clients/{id}/details")
    public ResponseEntity<Map<String, Object>> getClientDetails(@PathVariable Long id) {
        return clientRepository.findById(id).map(client -> {
            Map<String, Object> details = new HashMap<>();
            details.put("client", client);
            details.put("projects", projectRepository.findByClientId(id));
            details.put("requests", supportRequestRepository.findByClientId(id));
            return ResponseEntity.ok(details);
        }).orElse(ResponseEntity.notFound().build());
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

    @PutMapping("/projects/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return projectRepository.findById(id).map(project -> {
            if (payload.containsKey("projectName")) project.setProjectName((String) payload.get("projectName"));
            if (payload.containsKey("description")) project.setDescription((String) payload.get("description"));
            if (payload.containsKey("technologyStack")) project.setTechnologyStack((String) payload.get("technologyStack"));
            if (payload.containsKey("status")) project.setStatus((String) payload.get("status"));
            if (payload.containsKey("githubUrl")) project.setGithubUrl((String) payload.get("githubUrl"));
            if (payload.containsKey("assignedManager")) project.setAssignedManager((String) payload.get("assignedManager"));
            
            if (payload.containsKey("price") && payload.get("price") != null) {
                project.setPrice(Double.valueOf(payload.get("price").toString()));
            }
            if (payload.containsKey("deliveryDate") && payload.get("deliveryDate") != null) {
                if (!payload.get("deliveryDate").toString().isEmpty()) {
                    project.setDeliveryDate(java.time.LocalDate.parse(payload.get("deliveryDate").toString()));
                }
            }

            if (payload.containsKey("clientEmail")) {
                String clientEmail = (String) payload.get("clientEmail");
                if (clientEmail != null && !clientEmail.trim().isEmpty()) {
                    Client client = clientRepository.findAll().stream()
                            .filter(c -> c.getEmail().equalsIgnoreCase(clientEmail))
                            .findFirst()
                            .orElse(null);
                    
                    if (client == null) {
                        client = new Client();
                        client.setName(payload.containsKey("clientName") ? (String) payload.get("clientName") : "Client");
                        client.setEmail(clientEmail);
                        client.setCompanyName("Company Client");
                        client = clientRepository.save(client);
                    } else if (payload.containsKey("clientName") && payload.get("clientName") != null && !((String) payload.get("clientName")).trim().isEmpty()) {
                        client.setName((String) payload.get("clientName"));
                        client = clientRepository.save(client);
                    }
                    project.setClient(client);
                }
            }
            return ResponseEntity.ok(projectRepository.save(project));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable Long id) {
        return projectRepository.findById(id).map(project -> {
            projectRepository.delete(project);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
