Exercice 1

Vous disposez du code JavaScript suivant qui comporte une fonction de conversion d’une distance exprimée en kilomètres vers des radians ainsi que d’un document dont les coordonnées serviront de centre à notre sphère de recherche. Écrivez la requête $geoWithin qui affichera le nom des salles situées dans un rayon de 60 kilomètres et qui programment du Blues et de la Soul.

``` JS
var KilometresEnRadians = function(kilometres)
{ 
   var rayonTerrestreEnKm = 6371; 
   return kilometres / rayonTerrestreEnKm; 
}; 
 
db.salles.findOne({
   "adresse.ville": "Nîmes", 
   "styles": { $in: ["Bleues", "Soul"] },
   "loc": { 
      $geoWithin: {
         $center: { 
            coordinates: [[0, 0], 60]
         }
   }}
   },
   { "nom": true }); 
```


Exercice 2: 

Écrivez la requête qui permet d’obtenir la ville des salles situées dans un rayon de 100 kilomètres autour de Marseille, triées de la plus proche à la plus lointaine :

```
var marseille = {"type": "Point", "coordinates": [43.300000, 5.400000]} 
 
db.salles.find(...) 
```


Exercice 3:

Soit polygone un objet GeoJSON de la forme suivante :

```
var polygone = { 
     "type": "Polygon", 
     "coordinates": [ 
            [ 
               [43.94899, 4.80908], 
               [43.95292, 4.80929], 
               [43.95174, 4.8056], 
               [43.94899, 4.80908] 
            ] 
     ] 
} 
```

Donnez le nom des salles qui résident à l’intérieur.

