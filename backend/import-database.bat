@echo off
echo ========================================
echo  Import de la base de donnees MySQL
echo ========================================
echo.

REM Chemin vers MySQL (WAMP par defaut)
set MYSQL_PATH=C:\wamp64\bin\mysql\mysql8.0.31\bin

REM Ajouter MySQL au PATH temporairement
set PATH=%MYSQL_PATH%;%PATH%

echo Importation de database-setup.sql...
echo.
echo IMPORTANT: Entrez votre mot de passe MySQL quand demande
echo (Appuyez sur Entree si pas de mot de passe)
echo.

mysql -u root -p < database-setup.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo  Base de donnees importee avec succes!
    echo ========================================
    echo.
    echo La base 'gabarits_shop' contient:
    echo - 5 utilisateurs (dont 1 admin)
    echo - 12 templates (robes, pantalons, etc.)
    echo - 5 commandes de test
    echo - Tables: users, templates, orders, order_items
    echo.
    echo Email admin: admin@gabarits.com
    echo Mot de passe: password123
    echo.
) else (
    echo.
    echo ========================================
    echo  ERREUR lors de l'importation!
    echo ========================================
    echo.
    echo Verifiez:
    echo - MySQL est en cours d'execution
    echo - Le chemin MySQL est correct
    echo - Vos identifiants sont corrects
    echo.
)

pause
