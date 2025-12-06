package com.mobylab.springbackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // EXPENSE, INCOME

    private String icon;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Nullable for global categories

    public Long getId() {
        return id;
    }

    public Category setId(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public Category setName(String name) {
        this.name = name;
        return this;
    }

    public String getType() {
        return type;
    }

    public Category setType(String type) {
        this.type = type;
        return this;
    }

    public String getIcon() {
        return icon;
    }

    public Category setIcon(String icon) {
        this.icon = icon;
        return this;
    }

    public User getUser() {
        return user;
    }

    public Category setUser(User user) {
        this.user = user;
        return this;
    }
}
