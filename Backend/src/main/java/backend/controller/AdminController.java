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

    // --- Dashboard Overview Endpoint ---
    @GetMapping("/dashboard/overview")
    public ResponseEntity<Map<String, Object>> getDashboardOverview() {
        Map<String, Object> response = new HashMap<>();
        
        long totalClients = clientRepository.count();
        long activeProjects = projectRepository.findByStatus("In Progress").size();
        long totalProjects = projectRepository.count();

        // High-level stats
        response.put("totalClients", totalClients);
        response.put("activeProjects", activeProjects);
        response.put("totalProjects", totalProjects);
        
        response.put("recentProjects", projectRepository.findAll());
        
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
            request.setStatus(payload.get("status"));
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
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        return ResponseEntity.ok(projectRepository.save(project));
    }
}
