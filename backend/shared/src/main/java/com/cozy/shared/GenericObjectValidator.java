package com.cozy.shared;

import jakarta.validation.*;
import lombok.experimental.UtilityClass;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@UtilityClass
public class GenericObjectValidator {

    /**
     * Enforces english locale on validation exceptions to fix tests on
     * non-english developer machines.
     **/
    class LocaleSpecificMessageInterpolator implements MessageInterpolator {
        private final MessageInterpolator defaultInterpolator;

        LocaleSpecificMessageInterpolator(MessageInterpolator interpolator) {
            this.defaultInterpolator = interpolator;
        }

        @Override
        public String interpolate(String messageTemplate, Context context) {
            return defaultInterpolator.interpolate(messageTemplate, context, Locale.ENGLISH);
        }

        @Override
        public String interpolate(String messageTemplate, Context context, Locale locale) {
            return defaultInterpolator.interpolate(messageTemplate, context, Locale.ENGLISH);
        }
    }

    private final ValidatorFactory factory = Validation.byDefaultProvider()
            .configure()
            .messageInterpolator(new LocaleSpecificMessageInterpolator(Validation.byDefaultProvider()
                    .configure()
                    .getDefaultMessageInterpolator()))
            .buildValidatorFactory();
    private final Validator validator = factory.getValidator();

    public <D> Set<ConstraintViolation<D>> validate(D object) {
        return validator.validate(object);
    }

    public <D> Set<ConstraintViolation<D>> validate(List<D> objects) {
        Set<ConstraintViolation<D>> violations = new HashSet<>();
        for (D object : objects) {
            violations.addAll(validator.validate(object));
        }
        return violations;
    }
}
