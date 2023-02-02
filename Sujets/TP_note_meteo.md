Jeu de données: Téléchargez ou générez un jeu de données de stations météorologiques, qui incluent la date, la température, la pression atmosphérique, etc.

Préparation des données:
a. Importez les données de stations météorologiques dans MongoDB en utilisant la commande mongoimport.
b. Assurez-vous que les données sont bien structurées et propres pour une utilisation ultérieure.

Indexation avec MongoDB:
a. Créez un index sur le champ de la date pour améliorer les performances de la recherche. Utilisez la méthode createIndex ().
b. Vérifiez que l'index a été créé en utilisant la méthode listIndexes ().

Requêtes MongoDB:
a. Recherchez les stations météorologiques qui ont enregistré une température supérieure à 25°C pendant les mois d'été (juin à août). Utilisez la méthode find () et les opérateurs de comparaison pour trouver les documents qui correspondent à vos critères.
b. Triez les stations météorologiques par pression atmosphérique, du plus élevé au plus bas. Utilisez la méthode sort () pour trier les résultats.

Framework d'agrégation:
a. Calculez la température moyenne par station météorologique pour chaque mois de l'année. Utilisez le framework d'agrégation de MongoDB pour effectuer des calculs sur les données et grouper les données par mois.
b. Trouvez la station météorologique qui a enregistré la plus haute température en été. Utilisez le framework d'agrégation de MongoDB pour effectuer des calculs sur les données et trouver la valeur maximale.

Export de la base de données:
a. Exportez les résultats des requêtes dans un fichier CSV pour un usage ultérieur. Utilisez la commande mongoexport pour exporter des données de MongoDB.