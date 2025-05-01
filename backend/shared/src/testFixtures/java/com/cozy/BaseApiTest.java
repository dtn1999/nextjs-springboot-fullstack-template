package com.cozy;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.vavr.control.Try;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.nio.charset.StandardCharsets;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


public abstract class BaseApiTest extends MessagingTestConfiguration {
    public static final String USER_AUTH0_ID = "auth0|1234567890";
    public static final String ACCESS_TOKEN = "eyJhbGciOiI6IkpXVCJ9.eyJzdWIiOixNTE2MjM5MDIyfQ.SflKdQssw5c";

    @Autowired
    public ObjectMapper objectMapper;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public DbResetService dbResetService;

    protected SecurityMockMvcRequestPostProcessors.JwtRequestPostProcessor configureJwt() {
        return jwt().jwt(b -> b.subject(USER_AUTH0_ID).tokenValue(ACCESS_TOKEN));
    }

    @SneakyThrows
    protected ResultActions create_resource_without_authentication(String uri, Object body) {
        return Try.of(() -> post(uri)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body))
                )
                .mapTry(mockMvc::perform)
                .get()
                .andExpect(status().isUnauthorized())
                ;
    }

    @SneakyThrows
    protected ResultActions create_resource_without_authentication(String uri) {
        return create_resource_without_authentication(uri, null);
    }

    protected <T> T create_resource_with_authentication(String uri, Object body, HttpStatus expectedStatus, Class<T> clazz) {
        ResultActions result = create_resource_with_authentication(uri, body, expectedStatus);
        return parseResponse(result, clazz);
    }

    @SneakyThrows
    protected ResultActions create_resource_with_authentication(String uri, Object body, HttpStatus expectedStatus) {
        return Try.of(() -> post(uri)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body))
                        .with(configureJwt())
                )
                .mapTry(mockMvc::perform)
                .andThenTry(result -> result.andExpect(status().is(expectedStatus.value())))
                .get();
    }

    protected ResultActions create_resource_with_authentication(String uri, HttpStatus expectedStatus) {
        return create_resource_with_authentication(uri, null, expectedStatus);
    }

    protected <T> T create_resource_with_role(String uri, Object body, String role, HttpStatus expectedStatus, TypeReference<T> typeReference) {
        ResultActions result = create_resource_with_role(uri, body, role, expectedStatus);
        return parseResponse(result, typeReference);
    }

    protected ResultActions create_resource_with_role(String uri, Object body, String role, HttpStatus expectedStatus) {
        return Try.of(() -> post(uri)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body))
                        .with(configureJwt().authorities(new SimpleGrantedAuthority(role)))
                )
                .mapTry(mockMvc::perform)
                .andThenTry(result -> result.andExpect(status().is(expectedStatus.value())))
                .get();
    }

    protected <T> T create_resource_with_role(String uri, String role, HttpStatus expectedStatus, TypeReference<T> typeReference) {
        ResultActions result = create_resource_with_role(uri, role, expectedStatus);
        return parseResponse(result, typeReference);
    }

    protected ResultActions create_resource_with_role(String uri, String role, HttpStatus expectedStatus) {
        return create_resource_with_role(uri, null, role, expectedStatus);
    }

    @SneakyThrows
    protected ResultActions patch_resource_without_authentication(String uri, Object body) {
        return Try.of(() -> patch(uri)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body))
                )
                .mapTry(mockMvc::perform)
                .get()
                .andExpect(status().isUnauthorized())
                ;
    }

    protected <T> T patch_resource_with_role(String uri, Object body, String role, HttpStatus expectedStatus, Class<T> clazz) {
        ResultActions result = patch_resource_with_role(uri, body, role, expectedStatus);
        return parseResponse(result, clazz);
    }

    protected ResultActions patch_resource_with_role(String uri, Object body, String role, HttpStatus expectedStatus) {
        return Try.of(() -> patch(uri)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body))
                        .with(configureJwt().authorities(new SimpleGrantedAuthority(role)))
                )
                .mapTry(mockMvc::perform)
                .andThenTry(result -> result.andExpect(status().is(expectedStatus.value())))
                .get();
    }

    @SneakyThrows
    protected ResultActions read_resource_without_authentication(String uri) {
        return read_resource_without_authentication(uri, HttpStatus.UNAUTHORIZED);
    }

    protected <T> T read_resource_without_authentication(String uri, HttpStatus status, TypeReference<T> typeReference) {
        ResultActions result = read_resource_without_authentication(uri, status);
        return parseResponse(result, typeReference);
    }

    @SneakyThrows
    protected ResultActions read_resource_without_authentication(String uri, HttpStatus status) {
        return Try.of(() -> get(uri))
                .mapTry(mockMvc::perform)
                .get()
                .andExpect(status().is(status.value()));
    }

    protected <T> T read_resource_with_authentication(String uri, HttpStatus expectedStatus, TypeReference<T> typeReference) {
        ResultActions result = read_resource_with_authentication(uri, expectedStatus);
        return parseResponse(result, typeReference);
    }

    protected ResultActions read_resource_with_authentication(String uri, HttpStatus expectedStatus) {
        return Try.of(() -> get(uri).with(configureJwt()))
                .mapTry(mockMvc::perform)
                .andThenTry(result -> result.andExpect(status().is(expectedStatus.value())))
                .get();
    }

    protected <T> T read_resource_with_role(String uri, String role, HttpStatus expectedStatus, Class<T> clazz) {
        ResultActions result = read_resource_with_role(uri, role, expectedStatus);
        return parseResponse(result, clazz);
    }

    protected <T> T read_resource_with_role(String uri, String role, HttpStatus expectedStatus, TypeReference<T> typeReference) {
        ResultActions result = read_resource_with_role(uri, role, expectedStatus);
        return parseResponse(result, typeReference);
    }

    protected ResultActions read_resource_with_role(String uri, String role, HttpStatus expectedStatus) {
        return Try.of(() -> get(uri).with(configureJwt().authorities(new SimpleGrantedAuthority(role))))
                .mapTry(mockMvc::perform)
                .andThenTry(result -> result.andExpect(status().is(expectedStatus.value())))
                .get();
    }

    protected ResultActions update_resource_without_authentication(String uri, Object body) {
        return Try.of(() -> put(uri)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body))
                )
                .mapTry(mockMvc::perform)
                .andThenTry(result -> result.andExpect(status().is(HttpStatus.UNAUTHORIZED.value())))
                .get();
    }

    protected ResultActions update_resource_without_authentication(String uri) {
        return update_resource_without_authentication(uri, null);
    }


    protected ResultActions update_resource_with_authentication(String uri, Object body, HttpStatus expectedStatus) {
        return Try.of(() -> put(uri)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body))
                        .with(configureJwt())
                )
                .mapTry(mockMvc::perform)
                .andThenTry(result -> result.andExpect(status().is(expectedStatus.value())))
                .get();
    }

    protected ResultActions update_resource_with_authentication(String uri, HttpStatus expectedStatus) {
        return update_resource_with_authentication(uri, null, expectedStatus);
    }

    protected <T> T update_resource_with_role(String uri, Object body, String role, HttpStatus expectedStatus, TypeReference<T> typeReference) {
        ResultActions result = update_resource_with_role(uri, body, role, expectedStatus);
        return parseResponse(result, typeReference);
    }

    protected <T> T update_resource_with_role(String uri, String role, HttpStatus expectedStatus, Class<T> clazz) {
        ResultActions result = update_resource_with_role(uri, null, role, expectedStatus);
        return parseResponse(result, clazz);
    }

    protected ResultActions update_resource_with_role(String uri, Object body, String role, HttpStatus expectedStatus) {
        return Try.of(() -> put(uri)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body))
                        .with(configureJwt().authorities(new SimpleGrantedAuthority(role)))
                )
                .mapTry(mockMvc::perform)
                .andThenTry(result -> result.andExpect(status().is(expectedStatus.value())))
                .get();
    }

    protected ResultActions update_resource_with_role(String uri, String role, HttpStatus expectedStatus) {
        return update_resource_with_role(uri, null, role, expectedStatus);
    }

    @SneakyThrows
    protected ResultActions delete_resource_without_authentication(String uri) {
        return Try.of(() -> delete(uri))
                .mapTry(mockMvc::perform)
                .get()
                .andExpect(status().isUnauthorized())
                ;
    }

    protected ResultActions delete_resource_with_authentication(String uri, HttpStatus expectedStatus) {
        return Try.of(() -> delete(uri)
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(configureJwt())
                )
                .mapTry(mockMvc::perform)
                .andThenTry(result -> result.andExpect(status().is(expectedStatus.value())))
                .get();
    }

    protected ResultActions delete_resource_with_role(String uri, String role, HttpStatus expectedStatus) {
        return Try.of(() -> delete(uri)
                        .contentType(MediaType.APPLICATION_JSON)
                        .with(configureJwt().authorities(new SimpleGrantedAuthority(role)))
                )
                .mapTry(mockMvc::perform)
                .andThenTry(result -> result.andExpect(status().is(expectedStatus.value())))
                .get();
    }


    @SneakyThrows
    protected <T> T parseResponse(ResultActions response, Class<T> clazz) {
        String contentAsString = response.andReturn()
                .getResponse()
                .getContentAsString(StandardCharsets.UTF_8);
        return objectMapper.readValue(contentAsString, clazz);
    }

    @SneakyThrows
    protected <T> T parseResponse(ResultActions response, TypeReference<T> clazz) {
        String contentAsString = response.andReturn()
                .getResponse()
                .getContentAsString(StandardCharsets.UTF_8);
        return objectMapper.readValue(contentAsString, clazz);
    }

}
