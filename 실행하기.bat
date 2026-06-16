@echo off
chcp 65001 > nul
title 뷰빈AI 부동산마스터 V3 실행기
echo ==========================================================
echo   뷰빈AI 부동산마스터 V3 (팰루시드 완성본) 실행 중...
echo ==========================================================
echo.
echo   [안내] 로컬 웹 서버를 구동하고 브라우저를 자동 실행합니다.
echo          잠시만 기다려 주십시오...
echo.
echo   [서버 주소] http://localhost:3000
echo ==========================================================
echo.

:: 1. 의존성 설치 검사 (node_modules 폴더가 없는 경우 대비)
if not exist "%~dp0node_modules" (
    echo [알림] 첫 실행을 위해 패키지를 설치하고 있습니다. 잠시만 기다려 주세요...
    call npm install
)

:: 2. 브라우저로 로컬 호스트 열기 (백그라운드로 대기)
start http://localhost:3000

:: 3. Vite 개발 서버 실행
call npm run dev

pause
