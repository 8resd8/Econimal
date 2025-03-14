package com.ssafy.econimal.global.config;

import static org.assertj.core.api.Assertions.*;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

@SpringBootTest
class RedisConfigTest {

	@Autowired
	private RedisTemplate<String, String> redisTemplate;

	@Test
	void redisConnectionTest() {
		String key = "testKey";
		String value = "testValue";

		ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
		valueOperations.set(key, value);

		// when
		String retrievedValue = valueOperations.get(key);

		// then
		assertThat(retrievedValue).isEqualTo(value);
		
		// 삭제
		redisTemplate.delete(key);
	}
}