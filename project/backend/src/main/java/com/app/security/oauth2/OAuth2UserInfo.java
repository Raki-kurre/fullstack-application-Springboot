package com.app.security.oauth2;

import java.util.Map;

/**
 * Abstract wrapper around the OAuth2 user-info attributes returned by different providers.
 * Add more providers (GitHub, Facebook, etc.) by subclassing.
 */
public abstract class OAuth2UserInfo {

    protected Map<String, Object> attributes;

    public OAuth2UserInfo(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    public Map<String, Object> getAttributes() {
        return attributes;
    }

    public abstract String getId();
    public abstract String getName();
    public abstract String getEmail();
    public abstract String getImageUrl();
}
