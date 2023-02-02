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

    // ReStruturerCoordonneesJSON();
    // AjouterChampHeureOuverture();
    // CreerIndexHeureOuverture();

    //ListerRestaurantOuvertPartirDe(18);
    //ListerRestaurantParNoteCroissante();
    
    // coordonnée resto => le Neuvième Art
    ListerRestaurantApartirCoordonnees(45.76849365234375, 4.85646390914917, 2);
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

    console.log("Ajout champ heure ouverture: OK");
}

/**
 * Creer un object pour les coordonnées et supprimer lat et lng pour tout les documents
 * @returns void
 */
async function ReStruturerCoordonneesJSON()
{
    const retour = await collection
        .find()
        .project({ _id: true, lat: true, lng: true });

    // creer un obj localisation 
    for (const element of await retour.toArray()) 
    {
        await collection.updateOne(
            { _id: element._id }, 
            { $set: { localisation: { type:"Point", coordonnees: [element.lat, element.lng] }}});
    }

    // supp les clé lat et lng des documments
    await collection.updateMany({}, { $unset: { lat:"", lng:"" }})

    console.log("Restructurer coordonnées: OK");
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

async function ListerRestaurantApartirCoordonnees(_lattitude, _longitude, _distanceKm)
{
    const RAYON_TERRE_EQUATORIAL_KM = 6378.1;

    if(_distanceKm <= 0)
    {
        console.log([]);
        return;
    }

    const retour = await collection.find({ 
        "localisation.coordonnees":
        {
            $geoWithin: { 
            $centerSphere: [[_lattitude, _longitude], (_distanceKm / RAYON_TERRE_EQUATORIAL_KM) ] 
        }
    }}).project({ restaurant_name: true })

    console.log(await retour.toArray());
}

Connexion().finally(() => client.close);