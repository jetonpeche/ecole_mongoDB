Créez une base de données sample nommée "sample_db" et une collection appelée "employees".
Insérez les documents suivants dans la collection "employees":

{
   name: "John Doe",
   age: 35,
   job: "Manager",
   salary: 80000
}

{
   name: "Jane Doe",
   age: 32,
   job: "Developer",
   salary: 75000
}

{
   name: "Jim Smith",
   age: 40,
   job: "Manager",
   salary: 85000
}

Écrivez une requête MongoDB pour trouver tous les documents dans la collection "employees".

```JS
   db.employees.find()
```

Écrivez une requête pour trouver tous les documents où l'âge est supérieur à 33.

``` JS
   db.employees.find({ "age": { $gt: 33 }})
```

Écrivez une requête pour trier les documents dans la collection "employees" par salaire décroissant.

``` JS
   // dans le sort on donne sur quelle propriete on veut trier
   // -1 => ordre decroissant
   db.employees.find().sort({ "salaire": -1 })
```

Écrivez une requête pour sélectionner uniquement le nom et le job de chaque document.

``` JS
   // false => ne pas recuperer (par defaut tout est a false quand il y a un true sauf _id)
   db.employees.find({ }, { "_id": false, "nom": true, "job": true })
```

Écrivez une requête pour compter le nombre d'employés par poste.

``` JS

      // $job => valeur du champ job donnée comme propriete dans le group by

      // $count => compte le nombre de valeur egal sur la propriete
      db.employees.aggregate([
      { 
         $group: 
         {
            _id: "$job", 
            count: { $count: "$job" }
         }
      }])
```

Écrivez une requête pour mettre à jour le salaire de tous les développeurs à 80000.

``` JS
   // met a jour le salaire de tout les employees 
   // NumberInt() => cast en int
   db.employees.updateMany({ "salary": { $exists: true }}, { $set: { "salary": NumberInt(80000) }})
```


