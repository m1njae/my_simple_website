--topic table 생성
CREATE TABLE topic(
     id VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
     PRIMARY KEY(id));

-- id = major
INSERT INTO topic(id,description) VALUES('major','서울 한양대학교 체육학과 (주전공)<br>
    서울 한양대학교 컴퓨터소프트웨어학부 (다중전공)<br>
     <br>
     3학년 재학 중 <br>
     2018.03 ~  <br>
     2019.03 ~  <br>');

-- id = goal
INSERT INTO topic(id,description) VALUES('goal','준비 중입니다!');

-- id = BasicChallenge
INSERT INTO topic(id,description) VALUES('BasicChallenge','유튜브 컴공선배에서 진행하는 챌린지로서, 22일동안 매일 주어진 미션을 수행합니다!<br>
     2022.01.03(월) ~ 2022.01.24(화) 기간동안 진행됩니다!<br>
     Node.js 베이직 챌린지 진행 중에 있습니다.<br>
          <ol>
              <li>[DAY1] Node.js와 설치 </li>
              <li>[DAY2] Node.js로 웹 서버 만들기</li>
              <li>[DAY3] 변수 선언(var), 변수 형식과 활용</li>
              <li>[DAY4] 제어문: 조건문과 반복문</li>
              <li>[DAY5] 객체와 배열</li>
              <li>[DAY6] 배열과 반복문</li>
              <li>[DAY7] 함수</li>
              <li>[DAY8] 함수의 종류와 특징</li>
              <li>[DAY9] 동기와 비동기 1</li>
              <li>[DAY10] 동기와 비동기 2</li>
              <li>[DAY11] 간단한 프로그램 만들기1</li>
              <li>[DAY12] 간단한 프로그램 만들기2</li>
              <li>[DAY13] 간단한 프로그램 만들기3</li>
          </ol>');
