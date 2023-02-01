# Exercice 1

Vous disposez du code JavaScript suivant qui comporte une fonction de conversion d’une distance exprimée en kilomètres vers des radians ainsi que d’un document dont les coordonnées serviront de centre à notre sphère de recherche. Écrivez la requête $geoWithin qui affichera le nom des salles situées dans un rayon de 60 kilomètres et qui programment du Blues et de la Soul.

``` JS
// par defaut trier par ordre croissant par rapport a la distance distance
db.salles.find({
   "adresse.ville": "Nîmes", 
   "styles": { $in: ["Blues", "Soul"] },
   "adresse.localisation.coordinates": {
      $geoWithin: {
         // radius (2e param) => distance (km) / rayon equatorial de la terre (km) => (radian)
         // coordonée (1er param) => point d'origine
         $centerSphere: [[43.300000, 5.400000], (60 / 6378.1)]
   }}
   },
   { "nom": true }); 
```


# Exercice 2: 

Écrivez la requête qui permet d’obtenir la ville des salles situées dans un rayon de 100 kilomètres autour de Marseille, triées de la plus proche à la plus lointaine :

``` JS
// par defaut trier par ordre croissant par rapport a la distance distance
db.salles.find({
   "adresse.localisation.coordinates": {
      $geoWithin: {
         // radius (2e param) => distance (km) / rayon equatorial de la terre (km) => (radian)
         // coordonée (1 param) => point d'origine
         $centerSphere: [[43.300000, 5.400000], (100 / 6378.1)]
   }}
   },
   { "nom": true }); 
```


# Exercice 3:

Soit polygone un objet GeoJSON de la forme suivante :

``` JS
var polygone = 
[
   [ 
      [43.94899, 4.80908], 
      [43.95292, 4.80929], 
      [43.95174, 4.8056], 
      [43.94899, 4.80908],
   ] 
] 

db.salles.find({
   "adresse.localisation.coordinates":{
      $geoWithin:{
         $geometry:{
            type: "Polygon",
            coordonates: polygone
         }
      }
   }
},
{ "nom": true, "_id": false })
```

Donnez le nom des salles qui résident à l’intérieur.

