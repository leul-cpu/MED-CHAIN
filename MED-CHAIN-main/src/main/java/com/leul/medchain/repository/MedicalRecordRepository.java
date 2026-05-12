package com.leul.medchain.repository;


import com.leul.medchain.model.MedicalRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    
     Page<MedicalRecord> findByPatientNameContainingIgnoreCase(String name, Pageable pageable);
     Page<MedicalRecord> findByPatientUsername(String patientUsername, Pageable pageable);
     Page<MedicalRecord> findByPatientUsernameAndPatientNameContainingIgnoreCase(String patientUsername, String name, Pageable pageable);
}

