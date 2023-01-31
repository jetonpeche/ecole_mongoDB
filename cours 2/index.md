Exercice 1

Un bref examen de vos fichiers journaux a révélé que la plupart des requêtes effectuées sur la collection salles cible des capacités ainsi que des départements, comme ceci :

``` JS
db.salles.find({"capacite": {$gt: 500}, "adresse.codePostal": /^30/})

db.salles.find({"adresse.codePostal": /^30/, "capacite": {$lte: 400}}) 
```

Que proposez-vous comme index qui puisse couvrir ces requêtes ?

``` JS
    // 1 => classe les documents de facon croissante par rapport a la valeur de la propriete
    db.salles.createIndex({"capacite": 1, "adresse.codePostal": 1 })
```

Détruisez ensuite l’index créé.

``` JS
    // detruit l'index qui a les meme parametres
    db.salles.dropIndex({"capacite": 1, "adresse.codePostal": 1 })
```