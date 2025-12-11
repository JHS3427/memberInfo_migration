package com.springboot.bicycle_app.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.csrf.*;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;
import java.util.function.Supplier;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final JwtRequestFilter jwtRequestFilter;

//
//    @Autowired
//    public SecurityConfig(UserDetailsService userDetailsService) {
//        this.userDetailsService = userDetailsService;
//    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CORS 설정 (모든 IP 허용)
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();

                config.setAllowCredentials(true);    // 쿠키 허용
                config.addAllowedOriginPattern("*"); // 모든 IP Origin 허용
                config.addAllowedHeader("*");
                config.addAllowedMethod("*");

                return config;
            }))

            // CSRF 설정 (기존 유지)
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                .ignoringRequestMatchers("/auth/logout", "/cart/**", "/api/chatbot", "/auth/me", "/kakaopay/success", "/kakaopay/cancel", "/kakaopay/fail")  // 그대로 유지
                .csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler())
            )
            .authenticationProvider(authenticationProvider())//중간자 겸 공급자?
            .securityContext(sc -> sc.requireExplicitSave(true)) // ← 선택. true면 아래 로그인 컨트롤러에서 save 필요
            .sessionManagement((session) -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable())
            .requestCache(rc -> rc.disable()) //로그인 후 리다이렉트 방지
            //                .securityContext(sc -> sc.requireExplicitSave(true)) //인증정보 세션 자동저장 방지
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.POST, "/rental/payment", "/kakaopay/ready").permitAll()
                // 공개 API (읽기 전용)
                .requestMatchers(
                    "/member/**", "/products/**", "/auth/**", "/cart/**",
                    "/support/**", "/map/**", "/travel/**", "/csrf/**",
                    "/uploads/**",
                    "/api/chatbot", "/api/upload",
                    "/rental/**", "/kakaopay/success", "/kakaopay/cancel", "/kakaopay/fail"
                ).permitAll()

                // 게시판 조회(READ)만 허용 (GET)
                .requestMatchers(
                    "/api/board/news",
                    "/api/board/event",
                    "/api/board/review",
                    "/api/board/detail/**"
                ).permitAll()

                // 보호된 게시판 API (로그인 필요)
                .requestMatchers(
                    "/api/board/write",
                    "/api/board/update/**",
                    "/api/board/delete/**"
                ).authenticated()

                // 그 외 요청
                .anyRequest().permitAll()
            );

        return http.build();

    }//SecurityFilterChain Bean


    /**
     * 사용자의 인증 상태를 Http 세션에 저장하고 로드하는 역할을 담당하는 핵심 컴포넌트
     */
    @Bean
    public HttpSessionSecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }


    /**
     * 로그인 사용자 정보를 저장한 UserDetailService객체를 Dao객체(DB연동객체)의 파라미터로
     * 전송하고 AuthenticationProvider를 통해 로그인 실행
     */
    /** ✅ DaoAuthenticationProvider 하나만 등록 */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        //UserDetailsService는 service>CustomUserDetailsService에 있음.
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /** AuthenticationManager: DaoAuthenticationProvider + BCrypt */
    // ✅ 권장: AuthenticationManager는 AuthenticationConfiguration에서 가져오기
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }


    //CORS 보안정책 수행 객체
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000","http://172.16.250.24:3000", "http://172.16.250.148:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // ✅ 추가
        configuration.setAllowedHeaders(Arrays.asList("*")); // ✅ 모든 헤더 허용
        configuration.setExposedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);  // 🔥 프론트에서 JSESSIONID/CSRF 쿠키 받으려면 필수
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 회원가입 시 호출 --> 비밀번호 암호화 설정 (PasswordEncoder)
    // Spring Security는 반드시 비밀번호를 암호화하여 저장하고 비교해야 함!!
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}//SecurityConfig class


/**
 * ✨✨중요::
 * SPA(Single Page Application) : React, VUE 로 개발되는 사이트에서 CSRF 토큰 요청시
 * 필터링에서 호출하여 실행되는 CSRF 핸들러 객체
 */
final class SpaCsrfTokenRequestHandler implements CsrfTokenRequestHandler {
    private final CsrfTokenRequestHandler plain = new CsrfTokenRequestAttributeHandler();
    private final CsrfTokenRequestHandler xor = new XorCsrfTokenRequestAttributeHandler();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, Supplier<CsrfToken> csrfToken) {
        /*
         * Always use XorCsrfTokenRequestAttributeHandler to provide BREACH protection of
         * the CsrfToken when it is rendered in the response body.
         */
        this.xor.handle(request, response, csrfToken);
        /*
         * Render the token value to a cookie by causing the deferred token to be loaded.
         */
        csrfToken.get();
    }

    @Override
    public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
        String headerValue = request.getHeader(csrfToken.getHeaderName());
        /*
         * If the request contains a request header, use CsrfTokenRequestAttributeHandler
         * to resolve the CsrfToken. This applies when a single-page application includes
         * the header value automatically, which was obtained via a cookie containing the
         * raw CsrfToken.
         *
         * In all other cases (e.g. if the request contains a request parameter), use
         * XorCsrfTokenRequestAttributeHandler to resolve the CsrfToken. This applies
         * when a server-side rendered form includes the _csrf request parameter as a
         * hidden input.
         */
        return (StringUtils.hasText(headerValue) ? this.plain : this.xor).resolveCsrfTokenValue(request, csrfToken);
    }
}