// Ici j'appelle la fonction, j'aurais pu mettre cet appel après la fonction, c'est pareil.
main(); 

function construireGraphe(mescreatures, sesCreatures) {
    "use strict";
    for (let creature of creatures) {

    }
}
function main() {
    let creatures = [];
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
        const myScore = parseInt(readline());
        const foeScore = parseInt(readline());
        let monRegistreDeScans = [];
        let sonRegistreDeScans = [];
        let mesDrones          = [];
        let sesDrones          = [];
        let creaturesVisibles  = [];
        let light              = 1;
        const myScanCount = parseInt(readline());
        for (let i = 0; i < myScanCount; i++) {
            const creatureId = parseInt(readline());
            // On stocke juste les Id's des créatures qu'on a scannées
            monRegistreDeScans.push(creatureId);
        }
        const foeScanCount = parseInt(readline());
        for (let i = 0; i < foeScanCount; i++) {
            const creatureId = parseInt(readline());
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
            registreDrones.push(droneId+" "+creatureId);
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
        }
        for (let i = 0; i < myDroneCount; i++) {
            let closestDistance = +Infinity;
            let instructions = "";
            for (let j = 0; j < creaturesVisibles.length; j++) {
                // on exclut de la recherche les créatures déja scannées
                if (monRegistreDeScans.indexOf(creaturesVisibles[j].id) == -1) {                    
                    let distance = calculerDistance(mesDrones[i].coordonnees.x, creaturesVisibles[j].coordonnees.x, mesDrones[i].coordonnees.y, creaturesVisibles[j].coordonnees.y);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        targetSpot      = creaturesVisibles[j].coordonnees.x+" "+creaturesVisibles[j].coordonnees.y;
                    }    
                }                            
            }
            let niveauBatterie = mesDrones[i].niveauBatterie;
            // On choisit d'activer le flash par intermittence
            if (niveauBatterie <=5) {instructions = "WAIT 0 Au Calme un instant."; }
            else if (niveauBatterie < 15 && niveauBatterie > 5) { instructions = "MOVE "+targetSpot+" 0 Ka i ka fett ?" }
            else { instructions = "MOVE "+targetSpot+" 1 En mode Super Maco";} 
            printErr("BATTERIE : "+mesDrones[i].niveauBatterie)
            console.log(instructions);         // MOVE <x> <y> <light (1|0)> | WAIT <light (1|0)>

        }
        
    }
} 

function calculerDistance(x1, x2, y1, y2) {
    "use strict";
    return Math.round(Math.sqrt(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2)));
}
