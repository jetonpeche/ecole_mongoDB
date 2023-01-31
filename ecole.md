# logs

jetonpeche
nicolashalo01

# JSON

format universel pour stocker / ressevoir les données

## object vide

``` json
{}
```

## object clé/valeur

``` json
{ "cle": "valeur" }
```

## object clé / valeur

``` json
{ 
    "cle": "valeur",
    "liste": [
    {
        "cle": "valeur"
    },
    {
        "cle": "valeur"
    }]
}
```

## type donnée primitif JSON

- bool
- nombre
- string
- tableau
- object
- null

## type mongo

- date (8 octets signé) depuis 1/1/1970 (stock pas la timezone)
- ObjectId (12 octets signé) utilisé en interne pour garantir l'unicité dans la BDD
- numberLong / numberInt => mongo dit que toute valeur numerique est un numbre a virgule sur 8 octets
- numberDecimal 16 octets
- BinData stocké des caractere pas en UTF-8 et bianaire

# mongo

stocké en interne format BSON
cross platform
stocker format JSON
pas de structure imposé
pas de relation (SGBDR)
information stocké format object peut etre dupliqué (info tres vite dupliqué)
document dynmique (plastisité)

pas ORM, requete dynamique, tres scalable, struture claire et simple
permet d'etre bcp plus performant que SQL sur des qté astronomique de données
MAJ simple
support dev facile
tres vite la merde
chaque clé peut etre indexable

# cmd

## creer BDD

- `use` pour se co a une BDD qui existe pas
la BDD est creer a l'insert du premier doc

- `db` => mot reservé pour dialoguer avec la BDD en cours d'utilisation
- `db.uneCollection` => namespace en mongoDB

``` JS
    use tmp
    db.uneCollection.insertOne({ "cle": "valeur" }) // ou insertMany pour liste
```

``` JS
    db.uneCollection.find() // equivalent SELECT *
    db.uneCollection.find().pretty() // affiche juste les données
```

resultat =>
``` JS
    "_id": ObjectId("cb56FJ49DK"),
    "cle": "valeur"
```

## creer collection

``` JS
    db.createCollection("nom collection", /* options */ { "collation": { "local": "fr" }})
```

## MAJ

``` JS
    db.uneCollection.updateOne(<filtre>, <modification>);
```

exemple
``` JS
    db.personnes.updateOne(
        {
            // valeur a recuperer pour modifier
            "nom": "nom"
        },
        {
            // valeur de la cle a modifier
            $set: { "nom": "nouveau nom" }
        })
```

## supprimer une BDD

``` JS
    use maBDD
    db.dropDataBase()
```

pour vérifié => `show dbs` liste les BDD

# Methodes de recherche

``` JS
    // object JSON
    db.uneCollection.find("<requete>", "<collection>")
```

Augmente le max de ligne recuperer pour chaque requete
``` JS
    DBQuery.shellBatchSize = 40
```

ou dans `mongorc.js` (`home/userName`)

``` JS
    db.uneCollection.find().limit(12) // 12 ligne max
```

## avec condition

Egalité

``` JS
    db.uneCollection.find({ "age": { $eq: 76 }})
    // equivalent
    db.uneCollection.find({ "age": 76 })
```

## Récuperer les champs choisis (2e argument)

`true ou  1` => prend le champs (tout le reste est `false ou 0`)
Id doit etre `false ou 0` explicitement

``` JS
    // recupere le champs prenom
    db.uneCollection.find({ "age": 76 }, { "prenom": true })
```

- `$ne` => different de
- `$gt` => supperieur a
- `$gte` => supperieur ou egal
- `$in` & `$nin` => contient & ne contient pas

## recherche interval

Ordre des operateur pas important

``` JS
    // recupere age est entre 20 et 50
    db.uneCollection.find({ "age": { $lt: 20, $gt: 50 }})
```

## recherche avec ne contient pas les valeurs

``` JS
    // recupere age est entre 20 et 50
    db.uneCollection.find({ "age": { $nin: [23, 45, 78]}})
```

## verifier qu'un champs existe ($exist)

``` JS
    // verifie que l'age existe
    db.uneCollection.find({ "age": { $exists: true }})
```

## operateurs logique

`ET` logique par defaut

``` JS
    db.uneCollection.find({ 
        $and:[{
            "age": { $exists: true }
        },
        {
            "age": { $nin: [23, 45, 78] }
        }]
    }, 
    { 
        "_id": false,
        "nom": "1",
        "prenom": "1"
    })

    // equivalent
    db.uneCollection.find({ 
        "age": { 
            $exists: true,
            $nin: [23, 45, 78]
         }
    }, 
    { 
        "_id": false,
        "nom": "1",
        "prenom": "1"
    })
```

## $not

renvoie tout se qui est pas dans la condition ET les lignes qui n'ont pas le champs ciblé

``` JS
    db.uneCollection.find({ "age": { $not: { $lt: 70 }}})
```



## $where (lambda expression)

Attention = Gourmand ne pas les utiliser sur des gros volumes (performance moindre)

``` JS
    // verifie que l'age existe
    db.uneCollection.find({ $where: "this.nom.length > 4" })
```

## cmd helper

`runCommand()`

collation => information / regle de comparaison 

``` JS
    // verifie que l'age existe
    db.uneCollection.find({ "nom": "age" * 11 })
```