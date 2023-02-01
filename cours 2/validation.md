# Exercice 1 
Modifiez la collection salle afin que soient dorénavant validés les documents destinés à y être insérés ; cette validation aura lieu en mode « strict » et portera sur les champs suivants :

nom sera obligatoire et devra être de type chaîne de caractères.

capacite sera obligatoire et devra être de type entier (int).

Dans le champ adresse, les champs codePostal et ville, tous deux de type chaîne de caractères, seront obligatoires.

Que constatez-vous lors de la tentative d’insertion suivante, et quelle en est la cause ?

`user is not allowed to do action [collMod] on [tmp.salles]`
``` JS
    db.runCommand({
        collMod: "salles",
        validator: 
        { 
            $jsonSchema: 
            {
                bsonType: "object",
                required: [ "nom", "capacite", "adresse.ville", "adresse.codePostal" ],
            
                properties: 
                {
                    nom: { bsonType: "string" },
                    capacite: { bsonType: "int" },

                    adresse: {
                        ville:{ bsonType: "string" },
                        codePostal:{ bsonType: "string" }
                    }
                }
            } 
        },
   validationLevel: "strict"
})
```

``` js
db.salles.insertOne( 
{"nom": "Super salle", "capacite": 1500, "adresse": {"ville": "Musiqueville"}} 
) 
```

Que proposez-vous pour régulariser la situation ?
Ajouter un champs code postal à vide ou avec un espace ou mettre un code postal


# Exercice 2

Rajoutez à vos critères de validation existants un critère supplémentaire : le champ _id devra dorénavant être de type entier (int) ou ObjectId.

``` JS
    db.runCommand({
        collMod: "salles",
        validator: 
        { 
            $jsonSchema: 
            {
                bsonType: "object",
                required: [ "nom", "capacite", "adresse.ville", "adresse.codePostal" ],
            
                properties: 
                {
                    // ajout types predefini
                    _id: { bsonType: ["int", "objectId"] }
                    nom: { bsonType: "string" },
                    capacite: { bsonType: "int" },

                    adresse: {
                        ville:{ bsonType: "string" },
                        codePostal:{ bsonType: "string" }
                    }
                }
            } 
        },
   validationLevel: "strict"
})
```

Que se passe-t-il si vous tentez de mettre à jour l’ensemble des documents existants dans la collection à l’aide de la requête suivante :

``` JS
db.salles.updateMany({}, {$set: {"verifie": true}}) 
```

Supprimez les critères rajoutés à l’aide de la méthode delete en JavaScript

# Exercice 3

Rajoutez aux critères de validation existants le critère suivant :

``` JS
    db.runCommand({
        collMod: "salles",
        validator: 
        { 
            $jsonSchema: 
            {
                bsonType: "object",
                required: [ "smac", "nom", "capacite", "adresse.ville", "adresse.codePostal" ],
            
                properties: 
                {
                    _id: { bsonType: ["string", "objectId"] }
                    nom: { bsonType: "string" },
                    capacite: { bsonType: "int" },
                    smac: { enum: ["jazz", "soul", "funk", "blues"] },
                    adresse: {
                        ville:{ bsonType: "string" },
                        codePostal:{ bsonType: "string" }
                    }
                }
            } 
        },
   validationLevel: "strict"
})
```

Le champ smac doit être présent OU les styles musicaux doivent figurer parmi les suivants : "jazz", "soul", "funk" et "blues".

Que se passe-t-il lorsque nous exécutons la mise à jour suivante ?


db.salles.update({"_id": 3}, {$set: {"verifie": false}}) 
