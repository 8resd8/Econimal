# drop FROM user_character;
# DELETE FROM user_checklist;
# DELETE FROM characters;
# DELETE FROM product;
# DELETE FROM infrastructure;
# DELETE FROM facility;
# DELETE FROM town;
# DELETE FROM users;

-- 1. 제품(Product) 데이터
INSERT INTO product (product_id, price, product_type) VALUES (1, 0, 'CHARACTER');
INSERT INTO product (product_id, price, product_type) VALUES (2, 0, 'CHARACTER');
INSERT INTO product (product_id, price, product_type) VALUES (3, 0, 'CHARACTER');
INSERT INTO product (product_id, price, product_type) VALUES (4, 500, 'CHARACTER'); # 신규 캐릭터


# -- 1-1. 캐릭터(Character) 데이터
INSERT INTO characters (character_id, product_id, is_original, character_name, character_type, summary, description) VALUES
    (1, 1, 1, '부기부기', 'OCEAN', '바다에 사는 바다 거북이에요', '안녕, 나는 바다의 쓰레기를 줄여야 한다고 생각해. 여러분 도와주세요!. 바다의 플라스틱 쓰레기 때문에 바다 거북이들이 위험해지고 있어요. 여러분이 저희를 함께 도와주면 바다의 깨끗한 환경을 만들 수 있을 거예요');
INSERT INTO characters (character_id, product_id, is_original, character_name, character_type, summary, description) VALUES
    (2, 2, 1, '팽글링스', 'POLAR', '남극에 사는 펭귄이에요', '안녕, 나는 수영보다 걷기를 좋아하는 펭귄이야. 여러분 도와주세요!. 남극의 펭귄 친구들은 빙하가 녹아 힘들어하고 있어요. 여러분이 저희를 함께 도와주면 펭귄들이 행복하게 살 수 있는 환경을 만들 수 있을 거예요');
INSERT INTO characters (character_id, product_id, is_original, character_name, character_type, summary, description) VALUES
    (3, 3, 1, '호랭이', 'FOREST', '산 속에 사는 호랑이에요','안녕, 나는 숲의 보존이 중요하다고 생각해. 여러분 도와주세요!. 산림 파괴로 인해 호랑이의 서식지가 줄어들고 있어요. 여러분이 저희를 함께 도와주면 호랑이들이 안전하게 살 수 있는 숲을 지킬 수 있을 거예요');

# 신규 캐릭터
INSERT INTO characters (character_id, product_id, is_original, character_name, character_type, summary, description) VALUES
    (4, 4, 0, '언젠가추가될신규캐릭터', 'FOREST', '신규요약','신규 설명');

-- 2. 체크리스트(Checklist) 데이터
-- [ELECTRICITY]
INSERT INTO checklist (checklist_id, description, difficulty, eco_type, exp) VALUES
                                                                            (1, '사용하지 않는 방의 전등 끄기', 'LOW', 'ELECTRICITY', 10),
                                                                            (2, '에너지 소비 효율 1등급 가전제품 사용하기', 'MEDIUM', 'ELECTRICITY', 10),
                                                                            (3, '대기 전력 차단 멀티탭 사용 습관 들이기', 'LOW', 'ELECTRICITY', 10),
                                                                            (4, '냉장고 적정 온도 유지 및 문 여닫는 횟수 줄이기', 'MEDIUM', 'ELECTRICITY', 10),
                                                                            (5, '태양광 발전 시설 설치 고려하기 (주택, 건물)', 'HIGH', 'ELECTRICITY', 10);
-- [WATER]
INSERT INTO checklist (checklist_id, description, difficulty, eco_type, exp) VALUES
                                                                            (6, '양치컵 사용 및 물 받아쓰기', 'LOW', 'WATER', 10),
                                                                            (7, '샤워 시간 5분 줄이기', 'MEDIUM', 'WATER', 10),
                                                                            (8, '변기 수조에 벽돌이나 물병 넣어 물 절약하기', 'LOW', 'WATER', 10),
                                                                            (9, '세탁 시 빨랫감 모아서 한번에 돌리기', 'MEDIUM', 'WATER', 10),
                                                                            (10, '빗물 재활용 시설 설치 및 텃밭에 활용하기', 'HIGH', 'WATER', 10);
-- [GAS]
INSERT INTO checklist (checklist_id, description, difficulty, eco_type, exp) VALUES
                                                                            (11, '겨울철 내복 입고 실내 온도 20℃ 유지하기', 'LOW', 'GAS', 10),
                                                                            (12, '단열 에어캡(뽁뽁이) 창문에 부착하기', 'LOW', 'GAS', 10),
                                                                            (13, '고효율 보일러로 교체 고려하기', 'MEDIUM', 'GAS', 10),
                                                                            (14, '가스레인지 대신 인덕션이나 하이라이트 사용하기', 'MEDIUM', 'GAS', 10),
                                                                            (15, '친환경 콘덴싱 보일러 설치 지원 사업 활용하기', 'HIGH', 'GAS', 10);
-- [COURT]
INSERT INTO checklist (checklist_id, description, difficulty, eco_type, exp) VALUES
                                                                            (16, '전자 소송 적극 활용 및 종이 사용 줄이기', 'MEDIUM', 'COURT', 10),
                                                                            (17, '대중교통 이용 또는 카풀 생활화하기', 'LOW', 'COURT', 10),
                                                                            (18, '에너지 절약 캠페인 및 교육 참여하기', 'MEDIUM', 'COURT', 10),
                                                                            (19, '친환경 사무용품 사용하기 (재생 용지, 친환경 잉크)', 'LOW', 'COURT', 10),
                                                                            (20, '법원 내 에너지 절약 및 친환경 활동 적극 홍보 및 참여 독려', 'HIGH', 'COURT', 10);

-- 3. 시설(Facility) 데이터
INSERT INTO facility (facility_id, eco_type, facility_name) VALUES (1, 'GAS', 'GAS');
INSERT INTO facility (facility_id, eco_type, facility_name) VALUES (2, 'COURT', 'COURT');
INSERT INTO facility (facility_id, eco_type, facility_name) VALUES (3, 'ELECTRICITY', 'ELECTRICITY');
INSERT INTO facility (facility_id, eco_type, facility_name) VALUES (4, 'WATER', 'WATER');

-- 타운
INSERT INTO town (town_id, town_name) VALUES (1, '테스트마을이름');

-- 인프라(Infrastructure)
INSERT INTO infrastructure (infra_id, facility_id, town_id, is_clean) VALUES (1, 1, 1, false);
INSERT INTO infrastructure (infra_id, facility_id, town_id, is_clean) VALUES (2, 2, 1, false);
INSERT INTO infrastructure (infra_id, facility_id, town_id, is_clean) VALUES (3, 3, 1, false);
INSERT INTO infrastructure (infra_id, facility_id, town_id, is_clean) VALUES (4, 4, 1, false);


# 유저
INSERT INTO users (user_id, town_id, user_name, user_email, birth, password, coin, role)
VALUES(1, 1, 'hyunwoo', 'dkanfjgwls@naver.com', '2000-01-18', '!11112222', 100, 'USER');

# # -- 4-3. 원본 캐릭터를 기반으로 한 UserCharacter 데이터 생성
# INSERT INTO user_character (user_character_id, user_id, character_id, level, total_exp, expression, is_main) VALUES
#                                                                                                                  (10, 1, 1, 1, 0, 'SADNESS', 0),
#                                                                                                                  (11, 1, 2, 1, 0, 'SADNESS', 0),
#                                                                                                                  (12, 1, 3, 1, 0, 'SADNESS', 1);
# # -- 4-4. 랜덤 체크리스트를 기반으로 한 UserChecklist 데이터 생성
# INSERT INTO user_checklist (user_checklist_id, user_id, checklist_id, is_complete) VALUES
#                                                                                        (10, 1, 1, 0),
#                                                                                        (11, 1, 2, 0),
#                                                                                        (12, 1, 3, 0);
# # -- 4-5. 마을에 대한 Infrastructure 데이터 생성
# INSERT INTO infrastructure (infra_id, facility_id, town_id, is_clean) VALUES
#                                                                           (5, 1, 1, 0),
#                                                                           (6, 2, 1, 0),
#                                                                           (7, 3, 1, 0),
#                                                                           (8, 4, 1, 0);