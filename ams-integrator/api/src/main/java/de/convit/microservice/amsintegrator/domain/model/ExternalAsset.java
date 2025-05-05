package de.convit.microservice.amsintegrator.domain.model;

import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExternalAsset {
    private String id;
    private AMSProvider provider;
    private MediaType type;
    private String title;
    private String url;
    private String createdAt;
    private String updatedAt;
    private ObjectNode metadata;
}
