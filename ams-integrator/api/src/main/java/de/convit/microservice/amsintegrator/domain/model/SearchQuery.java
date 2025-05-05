package de.convit.microservice.amsintegrator.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchQuery {
    private AMSProvider provider;
    private String searchTerm;
    private int offset;
    private int limit;
}
