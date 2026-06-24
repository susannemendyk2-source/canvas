@echo off
cd /d E:\hb\polaris-server
C:\tools\maven\bin\mvn.cmd spring-boot:run -pl polaris-app --no-transfer-progress > backend-out.log 2> backend-err.log
