Voici la base de donnees qui permet d'effectuer la serie d'exercices : 

``` JS
db.salles.insertMany([ 
   { 
       "_id": 1, 
       "nom": "AJMI Jazz Club", 
       "adresse": { 
           "numero": 4, 
           "voie": "Rue des Escaliers Sainte-Anne", 
           "codePostal": "84000", 
           "ville": "Avignon", 
           "localisation": { 
               "type": "Point", 
               "coordinates": [43.951616, 4.808657] 
           } 
       }, 
       "styles": ["jazz", "soul", "funk", "blues"], 
       "avis": [{ 
               "date": new Date('2019-11-01'), 
               "note": NumberInt(8) 
           }, 
           { 
               "date": new Date('2019-11-30'), 
               "note": NumberInt(9) 
           } 
       ], 
       "capacite": NumberInt(300), 
       "smac": true 
   }, { 
       "_id": 2, 
       "nom": "Paloma", 
       "adresse": { 
           "numero": 250, 
           "voie": "Chemin de l'Aérodrome", 
           "codePostal": "30000", 
           "ville": "Nîmes", 
           "localisation": { 
               "type": "Point", 
               "coordinates": [43.856430, 4.405415] 
           } 
       }, 
       "avis": [{ 
               "date": new Date('2019-07-06'), 
               "note": NumberInt(10) 
           } 
       ], 
       "capacite": NumberInt(4000), 
       "smac": true 
   }, 
    { 
       "_id": 3, 
       "nom": "Sonograf", 
       "adresse": { 
           "voie": "D901", 
           "codePostal": "84250", 
           "ville": "Le Thor", 
           "localisation": { 
               "type": "Point", 
               "coordinates": [43.923005, 5.020077] 
           } 
       }, 
       "capacite": NumberInt(200), 
       "styles": ["blues", "rock"] 
   } 
]) 
```

`$exists` => permet de ne pas avoir d'erreur si le champ n'existe pas

# Exercice 1

Affichez l’identifiant et le nom des salles qui sont des SMAC.

``` JS
    db.salles.find({ "smac": { $exists: true, $eq: true }}, { "nom": true })
```

# Exercice 2

Affichez le nom des salles qui possèdent une capacité d’accueil strictement supérieure à 1000 places.

``` JS
    // _id: false => force a ne prend pas _id
    db.salles.find({ "capacite": { $exists: true, $gt: 1000 }}, { "_id": false, "nom": true })
```

# Exercice 3

Affichez l’identifiant des salles pour lesquelles le champ adresse ne comporte pas de numéro.

``` JS
    // _id: true (explicite) => affiche id uniquement 
    db.salles.find({ "adresse.numero": { $exists: false }}, { "_id": true })
```

# Exercice 4

Affichez l’identifiant puis le nom des salles qui ont exactement un avis.

``` JS
    // $size => donne la longeur d'une liste / _id => true implicite
    db.salles.find({ "avis": { $size: 1, $exists: true }}, { "nom": true })
```

# Exercice 5

Affichez tous les styles musicaux des salles qui programment notamment du blues.

``` JS
    // _id => ne prend pas / $in => contient la valeur X dans le tableau
    db.salles.find({ "styles": { $exists: true, $in: ["blues"] }}, { "_id": false, "nom": true, "styles": true })
```

# Exercice 6

Affichez tous les styles musicaux des salles qui ont le style « blues » en première position dans leur tableau styles.

``` JS
    // .0 => prend le 1 element de la liste
    db.salles.find({ "styles.0": { $exists: true, $in: ["blues"] }}, { "nom": true, "styles": true })
```

# Exercice 7

Affichez la ville des salles dont le code postal commence par 84 et qui ont une capacité strictement inférieure à 500 places (pensez à utiliser une expression régulière).

``` JS
    // regex => ^ => commence par
    db.salles.find({ "adresse.codePostal": { $regex: /^84/, $exists: true }, "capacite": { $lt: 500, $exists: true }}, { "adresse.ville": true })
```

# Exercice 8

Affichez l’identifiant pour les salles dont l’identifiant est pair ou le champ avis est absent.

``` JS
    // $mod => [divisible par, resultat du reste de la division]
    // ou logique avec deux conditions
    db.salles.find({ 
        $or: [{
            "_id": { $mod: [2, 0] }
        },
        {
            "avis": { $exists: false }
        }
    ]}, 
    { "_id": true })
```

# Exercice 9

Affichez le nom des salles dont au moins un des avis comporte une note comprise entre 8 et 10 (tous deux inclus).

``` JS
    // gte et $lte => compris entre 8 et 10 inclu
    db.salles.find({ "avis.note": { $exists: true, $gte: 8, $lte: 10 }}, { "nom": true })
```

# Exercice 10

Affichez le nom des salles dont au moins un des avis comporte une date postérieure au 15/11/2019 (pensez à utiliser le type JavaScript Date).

``` JS
    // ISODate => convertie string en object date formatter ISO
    db.salles.find({ "avis.date": { $exists: true, $gte: ISODate("2019-11-15") }}, { "nom": true })
```

# Exercice 11

Affichez le nom ainsi que la capacité des salles dont le produit de la valeur de l’identifiant par 100 est strictement supérieur à la capacité.

``` JS
    db.salles.find({"capacite": { $exists: true, $gt: "_id" * 100 }}, { "nom": true, "capacite": true, "_id": false })
```

# Exercice 12

Affichez le nom des salles de type SMAC programmant plus de deux styles de musiques différents en utilisant l’opérateur $where qui permet de faire usage de JavaScript.

``` JS
    // $where => syntaxe raccourci mais tres vide gourmande
    db.salles.find({ $where: () =>{
        return this.styles.length > 2 && this.smac === true

    }}, { "nom": true, "_id": false })
```

# Exercice 13

Affichez les différents codes postaux présents dans les documents de la collection salles.

``` JS
    // fonction distinct => champ, query
    // ne pas dupliquer la valeur du / champs choisi
    db.salles.distinct("adresse.codePostal", { "adresse.codePostal": { $exists: true }})
```

# Exercice 14

Mettez à jour tous les documents de la collection salles en rajoutant 100 personnes à leur capacité actuelle.

``` JS
    db.salles.updateMany({ "capacite": { $exists: true }}, { $inc: { "capacite":  NumberInt( +100) }})
```

# Exercice 15

Ajoutez le style « jazz » à toutes les salles qui n’en programment pas.

``` JS
    // $push => ajout dans le tableau
    // $nin => la / les valeurs xxxx n'existe pas dans salles
    db.salles.updateMany({ "styles": { $exists: true, $nin: ["jazz"] }}, 
    { 
        $push: { "styles": "jazz" }
    })
```

# Exercice 16

Retirez le style «funk» à toutes les salles dont l’identifiant n’est égal ni à 2, ni à 3.

``` JS

    // $pull => supprimer dans une liste (styles) la valeur choisi
    db.salles.updateMany({ "styles": { $exists: true }, "_id": { $nin: [2, 3] }}, 
    { 
        $pull: { "styles": "funk" }
    })
```

# Exercice 17

Ajoutez un tableau composé des styles «techno» et « reggae » à la salle dont l’identifiant est 3.

``` JS
    // $set => ajout d'une nouvelle propriete type liste
    db.salles.updateOne({ "_id": 3 }, { $set: { "nouveauStyles": ["techno", "reggae"] }});
```

# Exercice 18

Pour les salles dont le nom commence par la lettre P (majuscule ou minuscule), augmentez la capacité de 150 places et rajoutez un champ de type tableau nommé contact dans lequel se trouvera un document comportant un champ nommé telephone dont la valeur sera « 04 11 94 00 10 ».

``` JS
    // $inc => addiction
    // $set => ajout d'un nouveau champ type liste object
    // NumberInt() => cast le chiffre en int
    // regex => commence par p ou P
    db.salles.updateMany({ "nom": { $exists: true, $regex: /^[Pp]/ } }, 
    { 
        $inc: { "capacite": NumberInt(+150) },
        $set: { "contact": [{ 
            "telephone": "04 11 94 00 10" 
            }] 
        }
    })
```

# Exercice 19

Pour les salles dont le nom commence par une voyelle (peu importe la casse, là aussi), rajoutez dans le tableau avis un document composé du champ date valant la date courante et du champ note valant 10 (double ou entier). L’expression régulière pour chercher une chaîne de caractères débutant par une voyelle suivie de n’importe quoi d’autre est [^aeiou]+$.

``` JS
    // regex => voyelle sur la 1ere lettre
    // new Date() => date du jour
    // NumberInt() => cast le chiffre en int
    db.salles.updateMany({ "nom": { $regex: /^[aeiouyAEIOUY]/ }, "avis": { $exists: true }}, 
    { 
        $push: { "avis": { "date": new Date(), "note": NumberInt(10) }}
    })
```

# Exercice 20

En mode upsert, vous mettrez à jour tous les documents dont le nom commence par un z ou un Z en leur affectant comme nom « Pub Z », comme valeur du champ capacite 50 personnes (type entier et non décimal) et en positionnant le champ booléen smac à la valeur « false ».

``` JS
    // find() => condition pour recuperer l'object
    // update() => les valeurs a modifier
    // bulk => init une liste d'inscruction a executer
    var bulk = db.salles.initializeUnorderedBulkOp();
    bulk.find({ "nom": { $regex: /^[zZ]/ }}).upsert().update({ 
        "nom": "Pub Z", 
        "capacite": NumberInt(50),
        "smac": false
        })
```

# Exercice 21

Affichez le décompte des documents pour lesquels le champ _id est de type « objectId ».

Exercice 22

Pour les documents dont le champ _id n’est pas de type « objectId », affichez le nom de la salle ayant la plus grande capacité. Pour y parvenir, vous effectuerez un tri dans l’ordre qui convient tout en limitant le nombre de documents affichés pour ne retourner que celui qui comporte la capacité maximale.

Exercice 23

Remplacez, sur la base de la valeur de son champ _id, le document créé à l’exercice 20 par un document contenant seulement le nom préexistant et la capacité, que vous monterez à 60 personnes.

Exercice 24

Effectuez la suppression d’un seul document avec les critères suivants : le champ _id est de type « objectId » et la capacité de la salle est inférieure ou égale à 60 personnes.

Exercice 25

À l’aide de la méthode permettant de trouver un seul document et de le mettre à jour en même temps, réduisez de 15 personnes la capacité de la salle située à Nîmes.