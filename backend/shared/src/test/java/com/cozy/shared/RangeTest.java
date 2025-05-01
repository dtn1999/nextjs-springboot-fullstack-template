package com.cozy.shared;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.params.provider.Arguments.arguments;

class RangeTest {
    @ParameterizedTest
    @MethodSource("provideIntegerRanges")
    void testIntegerRange(Integer value, Integer start, Integer end, boolean expected) {
        Range<Integer> range = new Range<>(start, end);
        assertEquals(expected, range.between(value));
    }

    @ParameterizedTest
    @MethodSource("provideLongRanges")
    void testLongRange(Long value, Long start, Long end, boolean expected) {
        Range<Long> range = new Range<>(start, end);
        assertEquals(expected, range.between(value));
    }

    static Stream<Arguments> provideIntegerRanges() {
        return Stream.of(
                arguments(5, 1, 10, true),
                arguments(0, 1, 10, false),
                arguments(10, 1, 10, true),
                arguments(11, 1, 10, false)
        );
    }

    static Stream<Arguments> provideLongRanges() {
        return Stream.of(
                arguments(5L, 1L, 10L, true),
                arguments(0L, 1L, 10L, false),
                arguments(10L, 1L, 10L, true),
                arguments(11L, 1L, 10L, false)
        );
    }

}