# 🚀 Installation et lancement  

## Installation  

Assurez-vous d’installer `json-server` avec la version correcte :  

```bash
npm install -g json-server@0.17.0
```

⚠️ **Important** : La version `0.17.0` est requise, car les versions plus récentes ne prennent pas en charge certaines fonctionnalités essentielles comme les **middlewares** et la **recherche**.  

## Lancement de l'application  

Pour démarrer le serveur JSON :  

```bash
npx json-server --watch ./server/data/vaisseaux.json --middlewares ./server/middlewares.js
```

L'application sera accessible à l'adresse suivante :  
👉 [http://localhost:3000](http://localhost:3000)  
