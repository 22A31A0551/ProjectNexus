package backend.controller;

import backend.model.SupportRequest;
import backend.model.User;
import backend.repository.SupportRequestRepository;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/manager")
@CrossOrigin(origins = "*")
public class ManagerController {

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    @Autowired
    private UserRepository userRepository;

    // --- Dashboard Overview ---
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview(@RequestParam String manager) {
        Map<String, Object> response = new HashMap<>();

        List<SupportRequest> allAccepted = supportRequestRepository.findByStatus("Accepted");
        List<SupportRequest> activeTickets = allAccepted.stream()
                .filter(t -> t.getAssignedManager() != null && t.getAssignedManager().replaceAll("\\s+", "").equalsIgnoreCase(manager.replaceAll("\\s+", "")))
                .collect(Collectors.toList());
        List<SupportRequest> pendingTickets = supportRequestRepository
                .findByStatus("Pending");
        long unassignedPendingCount = pendingTickets.stream()
                .filter(t -> t.getAssignedDeveloper() == null || t.getAssignedDeveloper().trim().isEmpty())
                .count();
        List<SupportRequest> allClosed = supportRequestRepository.findByStatus("Closed");
        List<SupportRequest> closedTickets = allClosed.stream()
                .filter(t -> t.getAssignedManager() != null && t.getAssignedManager().replaceAll("\\s+", "").equalsIgnoreCase(manager.replaceAll("\\s+", "")))
                .collect(Collectors.toList());

        List<User> developers = userRepository.findByRole("DEVELOPER");

        response.put("activeCount", activeTickets.size());
        response.put("pendingCount", unassignedPendingCount);
        response.put("closedCount", closedTickets.size());
        response.put("developerCount", developers.size());
        response.put("recentActiveTickets", activeTickets.stream()
                .limit(5).collect(Collectors.toList()));

        return ResponseEntity.ok(response);
    }

    // --- Active Tickets (Accepted, scoped to manager) ---
    @GetMapping("/tickets/active")
    public ResponseEntity<List<SupportRequest>> getActiveTickets(@RequestParam String manager) {
        List<SupportRequest> allAccepted = supportRequestRepository.findByStatus("Accepted");
        List<SupportRequest> tickets = allAccepted.stream()
                .filter(t -> t.getAssignedManager() != null && t.getAssignedManager().replaceAll("\\s+", "").equalsIgnoreCase(manager.replaceAll("\\s+", "")))
                .collect(Collectors.toList());
        tickets.sort((a, b) -> {
            if (a.getSubmittedAt() == null) return 1;
            if (b.getSubmittedAt() == null) return -1;
            return b.getSubmittedAt().compareTo(a.getSubmittedAt());
        });
        return ResponseEntity.ok(tickets);
    }

    // --- Pending Tickets (global — all managers see all pending) ---
    @GetMapping("/tickets/pending")
    public ResponseEntity<List<SupportRequest>> getPendingTickets() {
        List<SupportRequest> tickets = supportRequestRepository.findByStatus("Pending");
        tickets.sort((a, b) -> {
            if (a.getSubmittedAt() == null) return 1;
            if (b.getSubmittedAt() == null) return -1;
            return b.getSubmittedAt().compareTo(a.getSubmittedAt());
        });
        return ResponseEntity.ok(tickets);
    }

    // --- Closed Tickets (scoped to manager) ---
    @GetMapping("/tickets/closed")
    public ResponseEntity<List<SupportRequest>> getClosedTickets(@RequestParam String manager) {
        List<SupportRequest> allClosed = supportRequestRepository.findByStatus("Closed");
        List<SupportRequest> tickets = allClosed.stream()
                .filter(t -> t.getAssignedManager() != null && t.getAssignedManager().replaceAll("\\s+", "").equalsIgnoreCase(manager.replaceAll("\\s+", "")))
                .collect(Collectors.toList());
        tickets.sort((a, b) -> {
            if (a.getSubmittedAt() == null) return 1;
            if (b.getSubmittedAt() == null) return -1;
            return b.getSubmittedAt().compareTo(a.getSubmittedAt());
        });
        return ResponseEntity.ok(tickets);
    }

    // --- Developer Workload ---
    @GetMapping("/developers/workload")
    public ResponseEntity<List<Map<String, Object>>> getDeveloperWorkload() {
        // Get all users with DEVELOPER role
        List<User> developers = userRepository.findByRole("DEVELOPER");

        // If no developers in DB, return fallback mock developers
        if (developers.isEmpty()) {
            List<Map<String, Object>> mockDevs = new ArrayList<>();
            String[][] mockData = {
                {"1", "Kiran Kumar", "kiran@projectnexus.com", "React, Node.js"},
                {"2", "Divya Rao", "divya@projectnexus.com", "Java, Spring Boot"},
                {"3", "Sai Teja", "sai@projectnexus.com", "Python, ML"},
                {"4", "Lakshmi Naidu", "lakshmi@projectnexus.com", "QA, Selenium"},
                {"5", "Venkat Raju", "venkat@projectnexus.com", "AWS, DevOps"}
            };
            List<SupportRequest> allActive = supportRequestRepository.findByStatus("Accepted");
            for (String[] dev : mockData) {
                long count = allActive.stream()
                        .filter(r -> dev[1].equalsIgnoreCase(r.getAssignedDeveloper()))
                        .count();
                Map<String, Object> entry = new HashMap<>();
                entry.put("id", Long.parseLong(dev[0]));
                entry.put("name", dev[1]);
                entry.put("email", dev[2]);
                entry.put("skills", dev[3]);
                entry.put("activeTickets", count);
                mockDevs.add(entry);
            }
            return ResponseEntity.ok(mockDevs);
        }

        List<SupportRequest> allActive = supportRequestRepository.findByStatus("Accepted");
        List<Map<String, Object>> result = new ArrayList<>();
        for (User dev : developers) {
            // Exclude the generic shared account name
            if (dev.getName() != null && (dev.getName().equalsIgnoreCase("Developer") || dev.getName().equalsIgnoreCase("Software Developer"))) {
                continue;
            }
            long count = allActive.stream()
                    .filter(r -> dev.getName() != null && dev.getName().equalsIgnoreCase(r.getAssignedDeveloper()))
                    .count();
            Map<String, Object> entry = new HashMap<>();
            entry.put("id", dev.getId());
            entry.put("name", dev.getName());
            entry.put("email", dev.getEmail());
            entry.put("skills", "");
            entry.put("activeTickets", count);
            result.add(entry);
        }
        result.sort((a, b) -> Long.compare((Long) a.get("activeTickets"), (Long) b.get("activeTickets")));
        return ResponseEntity.ok(result);
    }

    // --- Assign Developer to a Ticket ---
    @PutMapping("/tickets/{id}/assign-developer")
    public ResponseEntity<SupportRequest> assignDeveloper(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        return supportRequestRepository.findById(id).map(ticket -> {
            if (payload.containsKey("developer")) {
                ticket.setAssignedDeveloper(payload.get("developer"));
            }
            return ResponseEntity.ok(supportRequestRepository.save(ticket));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Close a Ticket ---
    @PutMapping("/tickets/{id}/close")
    public ResponseEntity<SupportRequest> closeTicket(@PathVariable Long id) {
        return supportRequestRepository.findById(id).map(ticket -> {
            ticket.setStatus("Closed");
            return ResponseEntity.ok(supportRequestRepository.save(ticket));
        }).orElse(ResponseEntity.notFound().build());
    }
}
