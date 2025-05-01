package com.cozy.shared.db;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedResponse<D> {
    private int page;
    private long limit;
    private long offset;
    private long total;
    private List<D> data;
}
