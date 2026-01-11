# GUIDE: Réinitialiser le mot de passe MySQL Root sur Windows

## Étape 1: Arrêter le service MySQL

1. Ouvrez PowerShell en tant qu'Administrateur
2. Exécutez:
```powershell
net stop MySQL80
# Ou si vous avez une autre version:
net stop MySQL57
```

## Étape 2: Créer un fichier de réinitialisation

1. Créez un fichier texte: C:\mysql-init.txt
2. Ajoutez cette ligne (remplacez 'nouveau_mot_de_passe' par votre choix):
```
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nouveau_mot_de_passe';
```

## Étape 3: Démarrer MySQL en mode réinitialisation

```powershell
# Trouvez d'abord où MySQL est installé:
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"

# Démarrez MySQL avec le fichier init:
mysqld --init-file=C:\mysql-init.txt --console
```

## Étape 4: Une fois le mot de passe changé

1. Arrêtez le serveur (Ctrl+C dans la console)
2. Supprimez le fichier C:\mysql-init.txt
3. Redémarrez MySQL normalement:
```powershell
net start MySQL80
```

## Étape 5: Testez la connexion

```powershell
mysql -u root -p
# Entrez votre nouveau mot de passe
```

---

## ALTERNATIVE PLUS SIMPLE: Utiliser SQLite

Si c'est trop compliqué, je recommande d'utiliser SQLite à la place!
SQLite ne nécessite:
- ❌ Pas de serveur à démarrer
- ❌ Pas de mot de passe
- ❌ Pas de configuration
- ✅ Fichier local simple
- ✅ Parfait pour le développement

Dites "sqlite" si vous préférez cette option!
