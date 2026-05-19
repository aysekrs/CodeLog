@echo off
start cmd /k "cd backend && .\mvnw spring-boot:run"
start cmd /k "cd frontend && npm run dev"
echo CodeLog tarafindan baslatiliyor... Backend ve Frontend aciliyor.