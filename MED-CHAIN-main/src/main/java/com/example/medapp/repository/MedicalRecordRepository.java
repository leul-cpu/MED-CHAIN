package com.example.medapp.repository;


import com.example.medapp.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    
     List<MedicalRecord> findByPatientNameContainingIgnoreCase(String name);
}

