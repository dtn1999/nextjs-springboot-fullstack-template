package com.cozy;

import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.core.annotation.AliasFor;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@EnableRabbit
@Testcontainers
@AutoConfigureMockMvc
@Import({ServiceModuleTestConfig.class})
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public @interface ServiceModuleTest {

    /**
     * Configuration class creating all beans needed for a module (domain) to work properly.
     * @return modules to load
     */
    @AliasFor(annotation = Import.class, attribute = "value")
    Class<?>[] value() default {};
}
