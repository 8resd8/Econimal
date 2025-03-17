package com.ssafy.econimal.global.resolver;

import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import com.ssafy.econimal.domain.user.entity.User;
import com.ssafy.econimal.domain.user.repository.UserRepository;
import com.ssafy.econimal.global.annotation.Login;
import com.ssafy.econimal.global.exception.InvalidArgumentException;
import com.ssafy.econimal.global.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class LoginArgumentResolver implements HandlerMethodArgumentResolver {

	private final UserRepository userRepository;
	private final JwtUtil jwtUtil;

	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		boolean isLogin = parameter.getParameterAnnotation(Login.class) != null;
		boolean isUser = parameter.getParameterType().equals(User.class);

		return isLogin && isUser;
	}

	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
		NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {

		HttpServletRequest request = (HttpServletRequest)webRequest.getNativeRequest();

		String token = jwtUtil.getResolveAccessToken(request);

		if (token == null) {
			return null;
		}

		Long userId = jwtUtil.getUserIdFromToken(token);

		return userRepository.findById(userId).orElseThrow(() -> new InvalidArgumentException("여기서 문제있으면 안됨"));
	}
}
