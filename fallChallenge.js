// Ici j'appelle la fonction, j'aurais pu mettre cet appel après la fonction, c'est pareil.
main(); 

function construireGraphe(mescreatures, sesCreatures) {
    "use strict";
    for (let creature of creatures) {

    }
}
function main() {
    let remonteeSurface    = false;
    let tour               = 0;
    let scoreArr           = [0];
    let targetSpot         = "";
    let creatures          = [];
    var monRegistreDeScans = [];
    var sonRegistreDeScans = [];
    let visited            = [];
    let registreDrones     = [];
    const creatureCount = parseInt(readline());
    for (let i = 0; i < creatureCount; i++) {
        var inputs = readline().split(' ');
        const creatureId = parseInt(inputs[0]);
        const color = parseInt(inputs[1]);
        const type = parseInt(inputs[2]);
        /* On récupère la liste des créatures ainsi que leur couleur et type.
        Ici on utilise un array dans lequel on insère un objet. 
        Vu qu'on l'a déclaré à la ligne 4, ce sera une variable globale, 
        c'est à dire qu'elle sera accessible partout dans notre fonction.*/
        creatures[i] = { "id":creatureId, "couleur":color, "type":type };
    }

    // game loop
    while (true) {        
        let radarInfo         = [];
        let mesDrones         = [];        
        let sesDrones         = [];
        let creaturesVisibles = [];
        let light             = 0;
        const myScore         = parseInt(readline());
        const foeScore        = parseInt(readline());
        const myScanCount = parseInt(readline());
        for (let i = 0; i < myScanCount; i++) {
            const creatureId = parseInt(readline());
            // On stocke juste les Id's des créatures qu'on a scannées
            monRegistreDeScans.push(creatureId);
        }
        const foeScanCount = parseInt(readline());
        for (let i = 0; i < foeScanCount; i++) {
            const creatureId = parseInt(readline());
            // Ainsi à chaque groupe d'entrées qu'on nous donne, il nous appartient de décider comment les stocker.
            // Le Array s'impose tout naturellement quand on veut stocker des éléments issus d'une boucle comme ici.
            sonRegistreDeScans.push(creatureId);
        }
        const myDroneCount = parseInt(readline());
        for (let i = 0; i < myDroneCount; i++) {
            var inputs = readline().split(' ');
            const droneId = parseInt(inputs[0]);
            const droneX = parseInt(inputs[1]);
            const droneY = parseInt(inputs[2]);
            const emergency = parseInt(inputs[3]);
            const battery = parseInt(inputs[4]);
            /**
             * Ici je fais le choix d'un Array d'Objet.
             * Pour accéder à une propriété, il faut penser à l'index de l'Array (number), puis au nom de la propriété (string)
             * par exemple si je veux accéder zu niveau de batterie du drone N°5, ce sera :
             * mesDrones[5]["niveauBatterie"] : notation avec crochets
             * mesDrones[5].niveauBatterie    : notation littérale
             **/
            mesDrones[i] = { "id":droneId, "coordonnees": { "x":droneX, "y":droneY }, "estEnUrgence":emergency, "niveauBatterie":battery };     
        }
        const foeDroneCount = parseInt(readline());
        for (let i = 0; i < foeDroneCount; i++) {
            var inputs = readline().split(' ');
            const droneId = parseInt(inputs[0]);
            const droneX = parseInt(inputs[1]);
            const droneY = parseInt(inputs[2]);
            const emergency = parseInt(inputs[3]);
            const battery = parseInt(inputs[4]);
            sesDrones[i] = { "id":droneId, "coordonnees": { "x":droneX, "y":droneY }, "estEnUrgence":emergency, "niveauBatterie":battery };
        }
        const droneScanCount = parseInt(readline());
        for (let i = 0; i < droneScanCount; i++) {
            var inputs = readline().split(' ');
            const droneId = parseInt(inputs[0]);
            const creatureId = parseInt(inputs[1]);
            if (isMyDrone(mesDrones, droneId) && registreDrones.indexOf(creatureId) == -1) { registreDrones.push(creatureId); }            
        }
        const visibleCreatureCount = parseInt(readline());
        for (let i = 0; i < visibleCreatureCount; i++) {
            var inputs = readline().split(' ');
            const creatureId = parseInt(inputs[0]);
            const creatureX = parseInt(inputs[1]);
            const creatureY = parseInt(inputs[2]);
            const creatureVx = parseInt(inputs[3]);
            const creatureVy = parseInt(inputs[4]);
            creaturesVisibles.push( { "id":creatureId, "coordonnees": { "x":creatureX, "y":creatureY }, "vx":creatureVx, "vy":creatureVy });
        }
        const radarBlipCount = parseInt(readline());
        for (let i = 0; i < radarBlipCount; i++) {
            var inputs = readline().split(' ');
            const droneId = parseInt(inputs[0]);
            const creatureId = parseInt(inputs[1]);
            const radar = inputs[2];
            radarInfo.push({"droneId":droneId, "creatureId":creatureId, "position":radar });
        }
        ///////////////////////////////////// DEBUT LOGIQUE ////////////////////////////////////////
        for (let i = 0; i < myDroneCount; i++) {
            let closestDistance = +Infinity;
            let instructions    = "";
            let niveauBatterie  = mesDrones[i].niveauBatterie;
            let myDroneCoords   = { "x":mesDrones[i].coordonnees.x, "y":mesDrones[i].coordonnees.y };
            // On choisit d'activer le flash par intermittence
            niveauBatterie <=5 ? light = 0 : light = 1;                   
            for (let j = 0; j < creaturesVisibles.length; j++) {
                // on exclut de la recherche les créatures déja scannées
                if (visited.indexOf(creaturesVisibles[j].id) == -1) {                    
                    let distance = calculerDistance(myDroneCoords.x, creaturesVisibles[j].coordonnees.x, myDroneCoords.y, creaturesVisibles[j].coordonnees.y);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        targetSpot      = creaturesVisibles[j].coordonnees.x+" "+creaturesVisibles[j].coordonnees.y;
                    }    
                }                            
            }
            //////////////////////////////////////// DEBUGGING ////////////////////////////////////////
            printErr("Score          : "+myScore+"|"+scoreArr[tour-1]+" ENNEMI : "+foeScore)
            printErr("Cible actuelle : "+targetSpot)
            printErr("Déjà scannés   : "+registreDrones)
            printErr("Info Radar     : "+JSON.stringify(radarInfo))
            printErr("BATTERIE       : "+mesDrones[i].niveauBatterie)
            ///////////////////////////////////////////////////////////////////////////////////////////
            // Dès qu'1 drone scanne au moins 1 créature, il remonte pour scorer
            if (registreDrones.length > 0) { remonteeSurface = true; }
            if (remonteeSurface) { 
                if (myDroneCoords.y <= 500) {
                    // C'est un booleén, il n'accepte donc que 2 valeurs : true ou false. Dans notre cas, le drone est à la surface ou en immersion.
                    remonteeSurface = false;
                    /* 2 arrays pour stocker les poissons scannés : 1 temporaire (registreDrones) et 1 global (visited)
                       Le temporaire pour gérer la décision de remontée à la surface,
                       le global pour zapper les poissons déjà scannés.
                       Remarquez que le global est déclaré en début de fonction avant la boucle principale du jeu,
                       ainsi on peut garder en mémoire son contenu à travers toute la partie.
                       C'est l'inverse pour les variables qu'on a déclarées dans la boucle, on veut intentionnellement 
                       que leur contenu soit effacé puis remis à jour à chaque tour du jeu, c'est à dire à chaque itération de la boucle principale. */
                    for (let node of registreDrones) { visited.push(node) }
                    registreDrones.length = 0;
                }
                
                else instructions = "MOVE "+myDroneCoords.x+" 490 "+light+" Livraison surface.";             
            }
            if (!remonteeSurface) { 
                instructions = getRadarInfo(radarInfo.slice(), visited.slice(), mesDrones[i].id, myDroneCoords)+" "+light;                        
            }
            scoreArr[tour] = myScore;
            tour++;
            console.log(instructions);
        }        
    }
} 

function getRadarInfo(radarInfo, visited, myDroneId, myDroneCoords) {
    "use strict";
    let instructions = "";
    for (let radar of radarInfo) {
        if (radar.droneId == myDroneId && visited.indexOf(radar.creatureId) == -1) {
            switch (radar.position) {
                case "TL": instructions = "MOVE "+(myDroneCoords.x - 600)+" "+(myDroneCoords.y - 600); break;
                case "BL": instructions = "MOVE "+(myDroneCoords.x - 600)+" "+(myDroneCoords.y + 600); break;
                case "TR": instructions = "MOVE "+(myDroneCoords.x + 600)+" "+(myDroneCoords.y - 600); break;
                case "BR": instructions = "MOVE "+(myDroneCoords.x + 600)+" "+(myDroneCoords.y + 600); break;                                
            }
        }
    }
    return instructions;
}

function calculerDistance(x1, x2, y1, y2) {
    "use strict";
    return Math.round(Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2)));
}

function isMyDrone(drones, droneId) {
    "use strict";
    for (let drone of drones) {
        if (drone.id === droneId) {
            return true;
        }
    }
    return false;
}
