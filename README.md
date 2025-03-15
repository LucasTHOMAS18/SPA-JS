## Installation :
``` bash
npm install -g json-server@0.17.0 http-server
```

## Lancement de l'application :
Démarrer le serveur JSON :  
``` bash
npx json-server --watch data/vaisseaux.json --port 3000
```

Lancer l'application (dans un second terminal) :
``` bash
http-server -p 8000
```
