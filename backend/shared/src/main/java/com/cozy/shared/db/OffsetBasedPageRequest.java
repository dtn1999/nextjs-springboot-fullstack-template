package com.cozy.shared.db;

import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.io.Serial;
import java.io.Serializable;

/**
 * A {@link Pageable} implementation representing pagination using the offset and limit parameters.
 */
@ToString
@EqualsAndHashCode
@SuppressWarnings("NullableProblems")
public class OffsetBasedPageRequest implements Pageable, Serializable {
    @Serial
    private static final long serialVersionUID = -25822477129613575L;

    private final long offset;
    private final int limit;
    private final Sort sort;
    private final int pageSize;

    public OffsetBasedPageRequest(long offset, int limit, int pageSize, Sort sort) {
        if (offset < 0) {
            throw new IllegalArgumentException("Offset index must not be less than zero!");
        }

        if (limit < 1) {
            throw new IllegalArgumentException("Limit must not be less than one!");
        }

        if (pageSize < 1) {
            throw new IllegalArgumentException("Page size must not be less than one!");
        }

        this.limit = limit;
        this.offset = offset;
        this.sort = sort;
        this.pageSize = pageSize;
    }

    public static OffsetBasedPageRequest of(long offset, int limit, int pageSize, Sort sort) {
        return new OffsetBasedPageRequest(offset, limit, pageSize, sort);

    }

    @Override
    public int getPageNumber() {
        return Math.toIntExact(offset / getPageSize());
    }

    @Override
    public int getPageSize() {
        return this.pageSize;
    }

    @Override
    public long getOffset() {
        return this.offset;
    }

    @Override
    public Sort getSort() {
        return this.sort;
    }

    @Override
    public Pageable next() {
        return new OffsetBasedPageRequest(getOffset() + getPageSize(), this.limit, getPageSize(), getSort());
    }

    public Pageable previous() {
        return this.getPageNumber() == 0 ? this : new OffsetBasedPageRequest(getOffset() - getPageSize(), this.limit, getPageSize(), getSort());
    }

    @Override
    public Pageable previousOrFirst() {
        return hasPrevious() ? previous() : first();
    }

    @Override
    public Pageable first() {
        return new OffsetBasedPageRequest(0, this.limit, getPageSize(), getSort());
    }

    @Override
    public Pageable withPage(int pageNumber) {
        // [-----------------------------dataset------------------------------]
        // [-----page1-----][-----page2-----][-----page3-----][-----page4-----] Based on pageSize
        // |----------------------------| offset
        //                              |-------------------| limit
        // in this case, the page number is 1 (0-based index)
        return new OffsetBasedPageRequest(((long) pageNumber) * ((long) getPageSize()), this.limit, getPageSize(), getSort());
    }

    @Override
    public boolean hasPrevious() {
        return this.offset > 0;
    }
}
