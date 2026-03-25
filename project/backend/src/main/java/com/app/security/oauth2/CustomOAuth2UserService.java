package com.app.security.oauth2;

import com.app.entity.Role;
import com.app.entity.User;
import com.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex) {
            log.error("OAuth2 processing error: {}", ex.getMessage());
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex);
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest request, OAuth2User oAuth2User) {
        String registrationId = request.getClientRegistration().getRegistrationId();
        String userNameAttr = request.getClientRegistration()
                .getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();

        // Build provider-specific user info wrapper
        OAuth2UserInfo userInfo = OAuth2UserInfoFactory
                .getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());

        if (userInfo.getEmail() == null || userInfo.getEmail().isBlank()) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        // Create or update the local user record
        User user = upsertUser(registrationId, userInfo);

        return new DefaultOAuth2User(
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())),
                oAuth2User.getAttributes(),
                userNameAttr);
    }

    /** Create a new user or update an existing one after OAuth2 login. */
    private User upsertUser(String provider, OAuth2UserInfo userInfo) {
        Optional<User> existingUser = userRepository.findByEmail(userInfo.getEmail());

        if (existingUser.isPresent()) {
            // Update profile picture / name in case they changed on Google
            User user = existingUser.get();
            user.setName(userInfo.getName());
            user.setImageUrl(userInfo.getImageUrl());
            return userRepository.save(user);
        }

        // First-time OAuth2 login — register the user
        User newUser = User.builder()
                .name(userInfo.getName())
                .email(userInfo.getEmail())
                .imageUrl(userInfo.getImageUrl())
                .provider(provider.toUpperCase())
                .providerId(userInfo.getId())
                .role(Role.USER)   // Default role for SSO users
                .build();

        log.info("Registering new OAuth2 user: {}", newUser.getEmail());
        return userRepository.save(newUser);
    }
}
