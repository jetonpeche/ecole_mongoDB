const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb+srv://jetonpeche:nicolashalo01@clustertest.04awe8v.mongodb.net/?retryWrites=true&w=majority");

var collection

async function Connexion()
{
    await client.connect();
    console.log("connecté !");

    // utilisation de la BDD tmp
    const db = client.db("tmp");

    // utilisation de la collection restaurant2
    collection = db.collection("restaurant3");

    console.log("bdd => ", db.namespace);
    console.log("collection => ", collection.namespace);

    // CreerIndexHeureOuverture()
    //ListerRestaurantOuvertPartirDe(18);
    //ListerRestaurantParNoteCroissante();
    //AjouterChampHeureOuverture();
}

/**
 * @returns void
 */
async function CreerIndexHeureOuverture()
{
    await collection.createIndex({ openHour: 1 });
    const retour = await collection.listIndexes().toArray();

    console.log("========= liste des indexs =============");
    console.log(await retour);
    console.log("========================================");
}

/**
 * @returns void
 */
async function AjouterChampHeureOuverture()
{
    const retour = await collection
        .find()
        .project({ _id: true });

    for (const element of await retour.toArray()) 
    {
        const nb = Math.floor(Math.random() * (20 - 8)) + 8;
        await collection.updateOne({ _id: element._id }, { $set:{ openHour: nb }});
    }

    console.log("OK");
}

/**
 * @param _heure int
 * @returns Liste [{ restaurant_name: string, openHour: number }]
 */
async function ListerRestaurantOuvertPartirDe(_heure)
{
    if(_heure <= 0 || _heure > 24)
    {
        console.log([]);
        return;
    }      

    const retour = await collection
        .find({ openHour: { $exists: true, $gte: _heure }})
        .sort({ openHour: 1 })
        // champs a recuperer
        .project({ _id: false, restaurant_name: true, openHour: true });

    console.log(await retour.toArray());
}

/**
 * 
 * @param _noteMin float de 0 à 5 (defaut 0)
 * @returns Liste [{ overallRating: number, restaurant_name: string }]
 */
async function ListerRestaurantParNoteCroissante(_noteMin = 0)
{
    if(_noteMin < 0 || _noteMin > 5)
    {
        console.log([]);
        return;
    }

    const retour = await collection
        .find({ overallRating: { $gte: _noteMin }})
        .sort({ overallRating: -1 })
        .project({ overallRating: true, restaurant_name: true, _id: false });
    
    console.log(await retour.toArray());
}

Connexion().finally(() => client.close);