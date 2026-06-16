package backend.controller;

import backend.model.User;
import backend.repository.UserRepository;
import lombok.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    private backend.repository.ClientRepository clientRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Email is already taken!"));
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("CLIENT")
                .build();

        userRepository.save(user);

        // Check if Client record already exists for this email (pre-stored by Admin)
        // If not, auto-create a Client profile for them so they are recognized in client portal
        boolean clientExists = clientRepository.findAll().stream()
                .anyMatch(c -> c.getEmail().equalsIgnoreCase(request.getEmail()));
        if (!clientExists) {
            backend.model.Client newClient = new backend.model.Client(
                request.getName(),
                request.getEmail(),
                "",
                "Individual Client"
            );
            clientRepository.save(newClient);
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/reset-passwords")
    public ResponseEntity<?> resetPasswords() {
        String newPassword = passwordEncoder.encode("password");
        java.util.List<User> users = userRepository.findAll();
        for (User user : users) {
            user.setPassword(newPassword);
            userRepository.save(user);
        }
        return ResponseEntity.ok(new MessageResponse("All passwords reset to 'password'"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Invalid email or password!"));
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Invalid email or password!"));
        }

        return ResponseEntity.ok(new AuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        ));
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
    }

    @Data
    @AllArgsConstructor
    public static class MessageResponse {
        private String message;
    }

    @Data
    @AllArgsConstructor
    public static class AuthResponse {
        private Long id;
        private String name;
        private String email;
        private String role;
    }
}
