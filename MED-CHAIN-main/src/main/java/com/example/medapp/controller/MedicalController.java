package com.example.medapp.controller;

import com.example.medapp.model.MedicalRecord;           
import com.example.medapp.repository.MedicalRecordRepository; 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class MedicalController {

    @Autowired
    private MedicalRecordRepository repository;

    private final String UPLOAD_DIR = "src/main/resources/static/uploads/";

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
    public MedicalRecord addRecord(@Valid @RequestBody MedicalRecord record) {
        return repository.save(record);
    }

    @PutMapping("/api/medical/update/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public MedicalRecord updateRecord(@PathVariable Long id, @Valid @RequestBody MedicalRecord recordDetails) {
        MedicalRecord record = repository.findById(id).orElseThrow(() -> new RuntimeException("Record not found"));
        record.setPatientName(recordDetails.getPatientName());
        record.setConditionName(recordDetails.getConditionName());
        record.setHospitalName(recordDetails.getHospitalName());
        record.setMedication(recordDetails.getMedication());
        record.setDoctorName(recordDetails.getDoctorName());
        record.setDuration(recordDetails.getDuration());
        record.setPatientUsername(recordDetails.getPatientUsername());
        return repository.save(record);
    }

    @PostMapping("/api/medical/upload/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public MedicalRecord uploadFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) throws IOException {
        MedicalRecord record = repository.findById(id).orElseThrow(() -> new RuntimeException("Record not found"));
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path path = Paths.get(UPLOAD_DIR + filename);
        Files.write(path, file.getBytes());
        record.setAttachmentPath("/uploads/" + filename);
        return repository.save(record);
    }

    @GetMapping("/api/medical/all")
    public Page<MedicalRecord> getAllRecords(Authentication authentication, 
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        String role = getRole(authentication);
        if (role.equals("ROLE_PATIENT")) {
            return repository.findByPatientUsername(authentication.getName(), pageable);
        }
        return repository.findAll(pageable);
    }

    @DeleteMapping("/api/medical/delete/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    public void deleteRecord(@PathVariable Long id) {
        repository.deleteById(id);
    }

    @GetMapping("/api/medical/search")
    public Page<MedicalRecord> searchRecords(Authentication authentication, 
                                             @RequestParam String name,
                                             @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        String role = getRole(authentication);
        if (role.equals("ROLE_PATIENT")) {
            return repository.findByPatientUsernameAndPatientNameContainingIgnoreCase(authentication.getName(), name, pageable);
        }
        return repository.findByPatientNameContainingIgnoreCase(name, pageable);
    }
}
