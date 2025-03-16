## Installation :
``` bash
npm install -g json-server@0.17.0 http-server
```

## Lancement de l'application :
Démarrer le serveur JSON :  
``` bash
npx json-server --watch ./server/data/vaisseaux.json --middlewares ./server/middlewares.js
```

Lancer l'application (dans un second terminal) :
``` bash
http-server -p 8000
```
