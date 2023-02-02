const { Parser } = require('json2csv');
const fs = require('fs');
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

    Init();

    // ListerRestaurantOuvertPartirDeAsync(18);
    // ListerRestaurantParNoteCroissanteAsync();
    // ListerRestaurantParPopulariterAsync()

    //MoyenneGlogalNoteRestaurantAsync()

    // // coordonnée resto => le Neuvième Art
    // ListerRestaurantApartirCoordonneesAsync(45.76849365234375, 4.85646390914917, 2);
}

/**
 * @param _heure int
 * @returns Liste [{ restaurant_name: string, openHour: number }]
 */
async function ListerRestaurantOuvertPartirDeAsync(_heure)
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

    let json = await retour.toArray();

    ExportRetourCSV(json, "ListerRestaurantOuvertPartirDe" + _heure);
}

/**
 * 
 * @param _noteMin float de 0 à 5 (defaut 0)
 * @returns Liste [{ overallRating: number, restaurant_name: string }]
 */
async function ListerRestaurantParNoteCroissanteAsync(_noteMin = 0)
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
    
    //console.log(await retour.toArray());

    // decharge les donnees pour la transformation en CSV
    let json = await retour.toArray();

    ExportRetourCSV(json, "listerRestaurantParNoteCroissante");
}

async function ListerRestaurantApartirCoordonneesAsync(_lattitude, _longitude, _distanceKm)
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

    let json = await retour.toArray();

    ExportRetourCSV(json, "listerRestaurantApartirCoordonnees");
}

/**
 * le popularité se fait en fonction du nombre de commentaires
 */
async function ListerRestaurantParPopulariterAsync()
{
    const PIPELINE =[
    { $match: { review_number: { $exists: true }}},
    { $project: { review_number: true, restaurant_name: true } },
    { $sort: { review_number: -1 }}
    ]

    const retour = await collection.aggregate(PIPELINE);

    console.log(await retour.toArray());
}

async function MoyenneGlogalNoteRestaurantAsync()
{
    var PIPELINE = [{
        $group: { _id: null, moyenne: { $avg: "$overallRating" } }
    }];

    const retour = await collection.aggregate(PIPELINE);

    // decharge la donnée
    const MOYENNE = await retour.toArray();

    console.log("Moyenne des restaurants: ", MOYENNE[0].moyenne);

    ExportRetourCSV(MOYENNE[0], "moyenneGlogalNoteRestaurant");
}

Connexion().finally(() => client.close);

function Init()
{
    CreerIndexHeureOuvertureAsync();
    AjouterChampHeureOuvertureAsync();
    ReStruturerCoordonneesJSONAsync();
}

/**
 * @returns void
 */
async function CreerIndexHeureOuvertureAsync()
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
async function AjouterChampHeureOuvertureAsync()
{
    const retour = await collection
        .find({ openHour: { $exists: false }})
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
async function ReStruturerCoordonneesJSONAsync()
{
    const retour = await collection
        .find({ localisation: { $exists: false }})
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

async function ExportRetourCSV(_json, _nomCSV)
{
    // creer le dossier si existe pas
    if (!fs.existsSync("./retour"))
        fs.mkdirSync("./retour");

    const PARSER = new Parser();
    const CSV = PARSER.parse(_json);

    fs.writeFileSync('./retour/' + _nomCSV, CSV);

    console.log("export " + _nomCSV + ".csv OK");
}
