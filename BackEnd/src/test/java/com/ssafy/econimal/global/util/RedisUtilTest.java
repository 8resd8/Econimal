package com.ssafy.econimal.global.util;

import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class RedisUtilTest {
	@Autowired
	private RedisTemplate<String, String> redisTemplate;

	public void flushRedis() {
		RedisConnectionFactory connectionFactory = redisTemplate.getConnectionFactory();
		if (connectionFactory != null) {
			connectionFactory.getConnection().serverCommands().flushAll();
		}
	}

	public void deleteKeyPattern(String pattern) {
		Set<String> keys = redisTemplate.keys(pattern);
		keys.forEach(key -> redisTemplate.delete(key));
	}
}
