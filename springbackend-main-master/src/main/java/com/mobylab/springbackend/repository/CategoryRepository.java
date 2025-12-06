package com.mobylab.springbackend.repository;

import com.mobylab.springbackend.entity.Category;
import com.mobylab.springbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByNameAndUser(String name, User user);
}
