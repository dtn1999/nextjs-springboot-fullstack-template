package com.cozy.api;

import com.cozy.shared.security.ManagementApiAdapter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/maintenance")
public class MaintenanceApi {
    private final ManagementApiAdapter managementApiAdapter;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/auth0/migrate-user-role/bulk")
    public ResponseEntity<String> migrateUserRole(@RequestParam("fromRole") String fromRole, @RequestParam("toRole") String toRole, @RequestParam(name = "force", defaultValue = "false") boolean force) {
        return this.managementApiAdapter.migrateUsersRole(fromRole, toRole, force)
                .map("%s users have been updated"::formatted)
                .map(ResponseEntity::ok)
                .onFailure(e -> log.error("Failed to change users role from {} to {}", fromRole, toRole))
                .onFailure(e -> log.error("", e))
                .get();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping("/auth0/remove-user-role/bulk")
    public ResponseEntity<String> removeUserRole(@RequestParam("role") String role, @RequestParam(name = "force", defaultValue = "false") boolean force) {
        return this.managementApiAdapter.removeUsersRole(role, force)
                .map("%s users have been updated"::formatted)
                .map(ResponseEntity::ok)
                .onFailure(e -> log.error("Failed to remove users role {}", role))
                .onFailure(e -> log.error("", e))
                .get();
    }

}
