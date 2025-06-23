------------------------------
------------------------------
-- 250624 배포 DB 수정 사항 --
------------------------------
------------------------------
-- src/post/post.entity.ts
ALTER TABLE post RENAME COLUMN viewCount TO view_count;

-- src/resume/entities/career.entity.ts
ALTER TABLE career RENAME COLUMN startAt TO start_at;
ALTER TABLE career RENAME COLUMN endAt TO end_at;

-- src/resume/entities/education.entity.ts
ALTER TABLE education RENAME COLUMN standardGrade TO standard_grade;
ALTER TABLE education RENAME COLUMN startAt TO start_at;
ALTER TABLE education RENAME COLUMN endAt TO end_at;

-- src/resume/entities/project.entity.ts
ALTER TABLE project RENAME COLUMN skillList TO skill_list;
ALTER TABLE project RENAME COLUMN startAt TO start_at;
ALTER TABLE project RENAME COLUMN endAt TO end_at;


------------------------------
------------------------------
-- 250624 배포 DB 수정 사항 --
------------------------------
------------------------------

---------------------------------------
-- 1. blog 수정사항: photo(nullable) --
---------------------------------------
-- 1-1. blog 칼럼 확인
SELECT 
  TABLE_NAME,
  COLUMN_NAME,
  COLUMN_TYPE,
  IS_NULLABLE
FROM 
  INFORMATION_SCHEMA.COLUMNS
WHERE 
  TABLE_SCHEMA = 'prod_db' -- 데이터베이스 이름
  AND TABLE_NAME = 'blog'; -- 테이블 이름
  
-- 1-2. blog 칼럼 수정(photo not null > null)
 ALTER TABLE prod_db.blog MODIFY COLUMN photo varchar(255) NULL;

--------------------------------------------
-- 2. post 수정사항. writer_id > owner_id --
--------------------------------------------
-- 2-1. post 조회
SELECT 
  TABLE_NAME,
  COLUMN_NAME,
  COLUMN_TYPE,
  IS_NULLABLE
FROM 
  INFORMATION_SCHEMA.COLUMNS
WHERE 
  TABLE_SCHEMA = 'prod_db' -- 데이터베이스 이름
  AND TABLE_NAME = 'post'; -- 테이블 이름
  
-- 2-2. 외래키 확인
SELECT
  *
FROM
  INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
  TABLE_SCHEMA = 'prod_db' -- 데이터베이스 이름
  AND TABLE_NAME = 'post'
  AND COLUMN_NAME = 'writer_id';

-- 2-3. 기존 외래키 삭지
ALTER TABLE post DROP FOREIGN KEY FK_90d79dc6b2cb6d222af76d876a3;

-- 2-4. 칼럼명 수정
ALTER TABLE post CHANGE writer_id owner_id varchar(255);

-- 2-5. 변경한 칼럼명으로 외래키 변경
ALTER TABLE post
ADD CONSTRAINT fk_owner_id
FOREIGN KEY (owner_id) REFERENCES user(id);

--------------------------------------------------------------------------------------------------------
-- 3. resume 수정사항 (education.description 삭제, education.standardGrade 추가, portfolio.type 삭제) --
--------------------------------------------------------------------------------------------------------

-- 3-1. resume 조회
SELECT 
  TABLE_NAME,
  COLUMN_NAME,
  COLUMN_TYPE,
  IS_NULLABLE
FROM 
  INFORMATION_SCHEMA.COLUMNS
WHERE 
  TABLE_SCHEMA = 'prod_db' -- 데이터베이스 이름
  AND TABLE_NAME = 'education'; -- 테이블 이름
  
-- 3-2. 필드 삭제(education.description)
ALTER TABLE education DROP COLUMN description;
-- 3-3. 필드 추가(education.standardGrade)
ALTER TABLE education ADD COLUMN standardGrade varchar(255) NULL;
-- 3-4. 필드 삭제(portfolio.type)
ALTER TABLE portfolio DROP COLUMN type;
