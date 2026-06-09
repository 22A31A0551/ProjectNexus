package backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "clients")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "company_name")
    private String companyName;

    @Column(name = "registered_date")
    private LocalDateTime registeredDate;

    @PrePersist
    protected void onCreate() {
        registeredDate = LocalDateTime.now();
    }

    // Constructors
    public Client() {}

    public Client(String name, String email, String phoneNumber, String companyName) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.companyName = companyName;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public LocalDateTime getRegisteredDate() { return registeredDate; }
    public void setRegisteredDate(LocalDateTime registeredDate) { this.registeredDate = registeredDate; }
}
