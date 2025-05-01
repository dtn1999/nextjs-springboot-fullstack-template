package com.cozy.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class SearchQuery {
    protected int limit;
    protected Long startFrom;

    public enum Order {
        ASC,
        DESC;
    }

}
