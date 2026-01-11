@echo off
echo ========================================
echo Reset MySQL Root Password via WAMP
echo ========================================
echo.

REM Trouver le chemin de mysql.exe dans WAMP
set MYSQL_PATH=C:\wamp64\bin\mysql\mysql8.0.27\bin\mysql.exe

REM Si le chemin n'existe pas, essayer les versions communes
if not exist "%MYSQL_PATH%" set MYSQL_PATH=C:\wamp64\bin\mysql\mysql5.7.36\bin\mysql.exe
if not exist "%MYSQL_PATH%" set MYSQL_PATH=C:\wamp\bin\mysql\mysql8.0.27\bin\mysql.exe
if not exist "%MYSQL_PATH%" set MYSQL_PATH=C:\wamp\bin\mysql\mysql5.7.36\bin\mysql.exe

echo Tentative de connexion a MySQL...
echo.
echo Si demande de mot de passe, appuyez juste sur ENTREE (mot de passe vide par defaut)
echo.

"%MYSQL_PATH%" -u root -p -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root'; FLUSH PRIVILEGES;"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Mot de passe change a: root
    echo ========================================
    echo.
    echo Mettez a jour votre fichier .env:
    echo DB_PASSWORD=root
    echo.
) else (
    echo.
    echo ========================================
    echo ERREUR lors du changement de mot de passe
    echo ========================================
    echo.
    echo Essayez via WAMP MySQL Console:
    echo 1. Clic droit sur icone WAMP
    echo 2. MySQL ^> MySQL Console
    echo 3. Appuyez sur ENTREE (pas de mot de passe)
    echo 4. Tapez: ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
    echo 5. Tapez: EXIT;
    echo.
)

pause
