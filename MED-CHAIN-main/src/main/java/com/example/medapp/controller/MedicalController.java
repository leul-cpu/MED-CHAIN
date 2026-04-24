package com.example.medapp.controller;

import com.example.medapp.model.MedicalRecord;           
import com.example.medapp.repository.MedicalRecordRepository; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MedicalController {

    @Autowired
    private MedicalRecordRepository repository;

    
    @GetMapping("/api/user/role")
    public String getRole(Authentication authentication) {
        if (authentication == null) return "UNKNOWN";
        return authentication.getAuthorities().stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("UNKNOWN");
    }

    
    @PostMapping("/api/medical/add")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public MedicalRecord addRecord(@RequestBody MedicalRecord record) {
        return repository.save(record);
    }

   
    @GetMapping("/api/medical/all")
    public List<MedicalRecord> getAllRecords() {
        return repository.findAll();
    }

    
    @DeleteMapping("/api/medical/delete/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public void deleteRecord(@PathVariable Long id) {
        repository.deleteById(id);
    }


    @GetMapping("/api/medical/search")
    public List<MedicalRecord> searchRecords(@RequestParam String name) {
        return repository.findByPatientNameContainingIgnoreCase(name);
    }

}
