package com.ssafy.econimal.global.util;

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
}
