# Dear Miracle

**Dear Miracle**은 HTML, CSS, JavaScript와 Firebase를 활용하여 제작한  
동아리 활동용 인터랙티브 웹 프로젝트입니다.

데스크톱 환경을 연상시키는 UI를 기반으로 게시판, 메시지, 미디어 콘텐츠 등 다양한 웹 기능을 하나의 화면에서 사용할 수 있도록 구현했습니다.

## Project Overview

- **프로젝트명**: Dear Miracle
- **형태**: Web Application
- **목적**: 웹 프론트엔드 및 Firebase 연동 기능 구현 학습
- **배포**: Vercel

## Main Features

### 인터랙티브 데스크톱 UI
- 데스크톱 환경을 모티브로 한 메인 화면
- 여러 기능을 창 형태로 표시
- 반응형 레이아웃 지원

### 교류 게시판
- 게시글 작성 및 조회
- 닉네임 기반 이용
- 활동 및 참여자 모집 내용 공유

### 메시지 기능
- 닉네임 기반 사용자 간 메시지 전송
- 메시지 목록 및 읽지 않은 메시지 표시
- Firebase Firestore를 활용한 데이터 저장

### 웹 알림
- Firebase Cloud Messaging을 활용한 웹 푸시 알림 기능 구현
- 사용자별 알림 토큰 관리

### 미디어 및 인터랙션
- 이미지 및 미디어 콘텐츠 표시
- 다양한 화면 요소와 사용자 인터랙션 구현

### Web App Manifest
- 모바일 홈 화면 추가를 위한 Web App Manifest 적용
- 앱 아이콘 및 standalone 화면 설정

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend / Database

- Firebase
- Cloud Firestore
- Firebase Cloud Messaging

### Deployment

- Vercel
- GitHub

## Project Structure

```text
Dear-miracle/
├── index.html
├── board.html
├── script.js
├── dm-badge.js
├── firebase-messaging-sw.js
├── manifest.webmanifest
├── effects.css
├── mobile-fix_CLEAN.css
├── css/
├── assets/
└── appicons/
```

## Deployment

서비스는 Vercel을 통해 배포하고 있습니다.

https://dear-miracle.vercel.app/

## What I Learned

이 프로젝트를 통해 다음 내용을 직접 구현하고 학습했습니다.

- HTML, CSS, JavaScript 기반 웹 UI 구성
- JavaScript DOM 조작과 이벤트 처리
- 반응형 웹 화면 구현
- Firebase Firestore를 이용한 데이터 저장 및 조회
- 사용자 간 메시지 기능 구현
- Firebase Cloud Messaging 연동
- Web App Manifest 구성
- GitHub를 이용한 버전 관리
- Vercel을 이용한 웹 프로젝트 배포

## Notes

본 프로젝트는 동아리 활동 및 웹 개발 학습을 목적으로 제작되었습니다.

닉네임 기반 간편 이용 방식을 사용하며, 실제 서비스 환경의 회원 인증 시스템과는 구조가 다릅니다.
