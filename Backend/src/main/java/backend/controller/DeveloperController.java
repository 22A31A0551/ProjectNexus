package backend.controller;

import backend.model.SupportRequest;
import backend.repository.SupportRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/developer")
@CrossOrigin(origins = "*")
public class DeveloperController {

    @Autowired
    private SupportRequestRepository supportRequestRepository;

    // --- Developer Overview Stats ---
    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview(@RequestParam String developer) {
        Map<String, Object> response = new HashMap<>();
        String normalizedDev = developer.trim();

        List<SupportRequest> allTickets = supportRequestRepository.findAll();

        List<SupportRequest> active = allTickets.stream()
                .filter(t -> "Accepted".equalsIgnoreCase(t.getStatus()) &&
                        Boolean.TRUE.equals(t.getDeveloperAccepted()) &&
                        t.getAssignedDeveloper() != null &&
                        t.getAssignedDeveloper().trim().equalsIgnoreCase(normalizedDev))
                .collect(Collectors.toList());

        List<SupportRequest> pending = allTickets.stream()
                .filter(t -> "Accepted".equalsIgnoreCase(t.getStatus()) &&
                        !Boolean.TRUE.equals(t.getDeveloperAccepted()) &&
                        t.getAssignedDeveloper() != null &&
                        t.getAssignedDeveloper().trim().equalsIgnoreCase(normalizedDev))
                .collect(Collectors.toList());

        List<SupportRequest> closed = allTickets.stream()
                .filter(t -> "Closed".equalsIgnoreCase(t.getStatus()) &&
                        t.getAssignedDeveloper() != null &&
                        t.getAssignedDeveloper().trim().equalsIgnoreCase(normalizedDev))
                .collect(Collectors.toList());

        response.put("activeCount", active.size());
        response.put("pendingCount", pending.size());
        response.put("closedCount", closed.size());
        response.put("recentActiveTickets", active.stream().limit(5).collect(Collectors.toList()));

        return ResponseEntity.ok(response);
    }

    // --- Active Tickets for Developer ---
    @GetMapping("/tickets/active")
    public ResponseEntity<List<SupportRequest>> getActiveTickets(@RequestParam String developer) {
        String normalizedDev = developer.trim();
        List<SupportRequest> active = supportRequestRepository.findAll().stream()
                .filter(t -> "Accepted".equalsIgnoreCase(t.getStatus()) &&
                        Boolean.TRUE.equals(t.getDeveloperAccepted()) &&
                        t.getAssignedDeveloper() != null &&
                        t.getAssignedDeveloper().trim().equalsIgnoreCase(normalizedDev))
                .sorted((a, b) -> {
                    if (a.getSubmittedAt() == null) return 1;
                    if (b.getSubmittedAt() == null) return -1;
                    return b.getSubmittedAt().compareTo(a.getSubmittedAt());
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(active);
    }

    // --- Pending Tickets for Developer ---
    @GetMapping("/tickets/pending")
    public ResponseEntity<List<SupportRequest>> getPendingTickets(@RequestParam String developer) {
        String normalizedDev = developer.trim();
        List<SupportRequest> pending = supportRequestRepository.findAll().stream()
                .filter(t -> "Accepted".equalsIgnoreCase(t.getStatus()) &&
                        !Boolean.TRUE.equals(t.getDeveloperAccepted()) &&
                        t.getAssignedDeveloper() != null &&
                        t.getAssignedDeveloper().trim().equalsIgnoreCase(normalizedDev))
                .sorted((a, b) -> {
                    if (a.getSubmittedAt() == null) return 1;
                    if (b.getSubmittedAt() == null) return -1;
                    return b.getSubmittedAt().compareTo(a.getSubmittedAt());
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(pending);
    }

    // --- Closed Tickets for Developer ---
    @GetMapping("/tickets/closed")
    public ResponseEntity<List<SupportRequest>> getClosedTickets(@RequestParam String developer) {
        String normalizedDev = developer.trim();
        List<SupportRequest> closed = supportRequestRepository.findAll().stream()
                .filter(t -> "Closed".equalsIgnoreCase(t.getStatus()) &&
                        t.getAssignedDeveloper() != null &&
                        t.getAssignedDeveloper().trim().equalsIgnoreCase(normalizedDev))
                .sorted((a, b) -> {
                    if (a.getSubmittedAt() == null) return 1;
                    if (b.getSubmittedAt() == null) return -1;
                    return b.getSubmittedAt().compareTo(a.getSubmittedAt());
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(closed);
    }

    // --- Resolve (Close) active ticket ---
    @PutMapping("/tickets/{id}/resolve")
    public ResponseEntity<SupportRequest> resolveTicket(@PathVariable Long id) {
        return supportRequestRepository.findById(id).map(ticket -> {
            ticket.setStatus("Closed");
            return ResponseEntity.ok(supportRequestRepository.save(ticket));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- Accept assigned ticket ---
    @PutMapping("/tickets/{id}/accept")
    public ResponseEntity<SupportRequest> acceptTicket(@PathVariable Long id) {
        return supportRequestRepository.findById(id).map(ticket -> {
            ticket.setDeveloperAccepted(true);
            return ResponseEntity.ok(supportRequestRepository.save(ticket));
        }).orElse(ResponseEntity.notFound().build());
    }
}
