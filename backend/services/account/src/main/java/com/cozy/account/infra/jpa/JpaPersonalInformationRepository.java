package com.cozy.account.infra.jpa;

import com.cozy.account.core.model.entity.PersonalInformation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface JpaPersonalInformationRepository extends JpaRepository<PersonalInformation, Long> {

    @Query("""
                SELECT COUNT(p) FROM PersonalInformation  p WHERE p.email = :email
            """)
    int countByEmail(@Param("email") String email);

}
