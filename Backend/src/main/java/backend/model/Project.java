package backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_name", nullable = false)
    private String projectName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "technology_stack")
    private String technologyStack;

    @Column(name = "delivery_date")
    private LocalDate deliveryDate;

    @Column(name = "deployment_url")
    private String deploymentUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(name = "status")
    private String status; // e.g., "In Progress", "Completed", "Maintenance"

    // Constructors
    public Project() {}

    public Project(String projectName, String description, String technologyStack, LocalDate deliveryDate, Client client) {
        this.projectName = projectName;
        this.description = description;
        this.technologyStack = technologyStack;
        this.deliveryDate = deliveryDate;
        this.client = client;
        this.status = "In Progress";
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProjectName() { return projectName; }
    public void setProjectName(String projectName) { this.projectName = projectName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTechnologyStack() { return technologyStack; }
    public void setTechnologyStack(String technologyStack) { this.technologyStack = technologyStack; }

    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }

    public String getDeploymentUrl() { return deploymentUrl; }
    public void setDeploymentUrl(String deploymentUrl) { this.deploymentUrl = deploymentUrl; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
