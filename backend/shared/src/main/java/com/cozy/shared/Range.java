package com.cozy.shared;

import lombok.Builder;

import java.util.Objects;

@Builder
public record Range<T extends Comparable<T>>(T min, T max) {

    public boolean between(T value) {
        if (Objects.isNull(min) && Objects.isNull(max)) {
            return true;
        }
        if (Objects.nonNull(min) && Objects.isNull(max)) {
            return min.compareTo(value) <= 0;
        }
        if (Objects.isNull(min)) {
            return max.compareTo(value) >= 0;
        }
        return min.compareTo(value) <= 0 && max.compareTo(value) >= 0;
    }


    public static Range<Integer> getRangeOrDefaultInt(Range<Integer> range) {
        if (Objects.isNull(range)) {
            return new Range<>(0, Integer.MAX_VALUE);
        }
        return range;
    }

    public static Range<Long> getRangeOrDefaultLong(Range<Long> range) {
        if (Objects.isNull(range)) {
            return new Range<>(0L, Long.MAX_VALUE);
        }
        return range;
    }

}
