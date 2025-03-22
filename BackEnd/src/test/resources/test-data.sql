-- 1. 제품(Product) 데이터
INSERT INTO product (product_id, price, product_type) VALUES (1, 0, 'CHARACTER');
INSERT INTO product (product_id, price, product_type) VALUES (2, 0, 'CHARACTER');
INSERT INTO product (product_id, price, product_type) VALUES (3, 0, 'CHARACTER');


-- 1-1. 캐릭터(Character) 데이터
INSERT INTO characters (character_id, product_id, character_name, character_type, summary, description) VALUES
    (1, 1, '부기부기', 'OCEAN', '바다에 사는 바다 거북이에요', '안녕, 나는 바다의 쓰레기를 줄여야 한다고 생각해. 여러분 도와주세요!. 바다의 플라스틱 쓰레기 때문에 바다 거북이들이 위험해지고 있어요. 여러분이 저희를 함께 도와주면 바다의 깨끗한 환경을 만들 수 있을 거예요');
INSERT INTO characters (character_id, product_id, character_name, character_type, summary, description) VALUES
    (2, 2, '팽글링스', 'POLAR', '남극에 사는 펭귄이에요', '안녕, 나는 수영보다 걷기를 좋아하는 펭귄이야. 여러분 도와주세요!. 남극의 펭귄 친구들은 빙하가 녹아 힘들어하고 있어요. 여러분이 저희를 함께 도와주면 펭귄들이 행복하게 살 수 있는 환경을 만들 수 있을 거예요');
INSERT INTO characters (character_id, product_id, character_name, character_type, summary, description) VALUES
    (3, 3, '호랭이', 'FOREST', '산 속에 사는 호랑이에요','안녕, 나는 숲의 보존이 중요하다고 생각해. 여러분 도와주세요!. 산림 파괴로 인해 호랑이의 서식지가 줄어들고 있어요. 여러분이 저희를 함께 도와주면 호랑이들이 안전하게 살 수 있는 숲을 지킬 수 있을 거예요');

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

-- 3. 인프라(Infrastructure) 데이터
-- 가스저장
INSERT INTO town (town_id, town_name) VALUES (1, '0지');
INSERT INTO facility (facility_id, eco_type, facility_name) VALUES (1, 'GAS', 'GAS');
INSERT INTO infrastructure (infra_id, facility_id, town_id, is_clean) VALUES (1, 1, 1, false);
-- 법원저장
INSERT INTO town (town_id, town_name) VALUES (2, '0지');
INSERT INTO facility (facility_id, eco_type, facility_name) VALUES (2, 'COURT', 'COURT');
INSERT INTO infrastructure (infra_id, facility_id, town_id, is_clean) VALUES (2, 2, 2, false);
-- 전기저장
INSERT INTO town (town_id, town_name) VALUES (3, '0지');
INSERT INTO facility (facility_id, eco_type, facility_name) VALUES (3, 'ELECTRICITY', 'ELECTRICITY');
INSERT INTO infrastructure (infra_id, facility_id, town_id, is_clean) VALUES (3, 3, 3, false);
-- 물저장
INSERT INTO town (town_id, town_name) VALUES (4, '나는 물이좋아');
INSERT INTO facility (facility_id, eco_type, facility_name) VALUES (4, 'WATER', 'WATER');
INSERT INTO infrastructure (infra_id, facility_id, town_id, is_clean) VALUES (4, 4, 4, false);

-- 4. 유저(User) 데이터
-- 유저를 위한 타운 생성
INSERT INTO town (town_id, town_name) VALUES (5, '현우마을');
INSERT INTO town (town_id, town_name) VALUES (6, '윤호마을');
INSERT INTO town (town_id, town_name) VALUES (7, '재완마을');
-- 유저 데이터 삽입
INSERT INTO users (user_id, town_id, user_name, user_email, birth, password, coin, role) VALUES
    (1, 5, 'hyunwoo', 'dkanfjgwls@naver.com', '2000-01-18', '!11112222', 100, 'USER');
INSERT INTO users (user_id, town_id, user_name, user_email, birth, password, coin, role) VALUES
    (2, 6, 'yunho', 'yunho_yun@naver.com', '2000-01-18', '!11112222', 100, 'USER');
INSERT INTO users (user_id, town_id, user_name, user_email, birth, password, coin, role) VALUES
    (3, 7, 'jaewan', 'jjw05015@gmail.com', '2000-01-18', '!11112222', 100, 'USER');
