class Cellule {
    constructor(li, co) {
        this.li = li;
        this.co = co;
        this.etat = -1;
        this.atome = false;
        this.rond = false;
        this.dom = null;
        this.grille = (li > 0) && (li < 9) && (co > 0) && (co < 9);
    }

    initialiser() {
        var couleur = "";
        if ((this.li === 0 && this.co === 0) || (this.li === 0 && this.co === 9) || (this.li === 9 &&
            this.co === 0) || (this.li === 0 && this.co === 0) || (this.li === 9 && this.co === 9)) { // les 4 coins
            couleur = 'grey';
        } else if (this.li === 0 || this.co === 0 || this.li === 9 || this.co === 9) { // les boutons latéraux ou les pions joué
            couleur = 'darkgrey';
        }
        else {
            couleur = "white";
        }
        this.dom.style.backgroundColor = couleur;
        this.dom.addEventListener("click", () => {
            if (couleur == 'white') {
                if (this.rond) {
                    this.enleverRond();
                    this.rond = false;
                } else {
                    this.ajouterRond();
                    this.rond = true;
                }
            } else if (couleur == 'darkgrey') {
                this.couleur = getRandomColor();
                this.dom.style.backgroundColor = this.couleur;
                tirer(this);
            }
        });
    }

    ajouterRond() {
        let rond = document.createElement("div");
        rond.className = "rond";
        ronds.push(this);
        rond.id = this.li + "" + this.co;
        this.dom.appendChild(rond);
    }
    enleverRond() {
        let rond = document.getElementById(this.li + "" + this.co);
        this.dom.removeChild(rond);
        var index = ronds.indexOf(this);
        if (index !== -1) {
            ronds.splice(index, 1);
        }
    }
    majCouleur(uneCouleur) {
        this.couleur = uneCouleur;
        this.dom.style.backgroundColor = this.couleur;
    }
}

function tirer(cellule) {
    if (cellule.li == 0) {
        calculScore(cellule, resultatDuTir(cellule, 1, 0))
    } else if (cellule.li == 9) {
        calculScore(cellule, resultatDuTir(cellule, -1, 0));
    } else if (cellule.co == 0) {
        calculScore(cellule, resultatDuTir(cellule, 0, 1));
    } else {
        calculScore(cellule, resultatDuTir(cellule, 0, -1));
    }
}

function calculScore(start, end){
    if(end == null){
        score++;
    } else if (start.li != end.li && start.co != end.co){
        score += 2;
        end.majCouleur(start.couleur);
    } else {
        score++;
        end.majCouleur(start.couleur);
    }
}

function tabCell() {
    var div = document.getElementById("jeu");
    var table = document.createElement("table");
    div.appendChild(table);

    for (let i = 0; i < 10; i++) {
        let tr = document.createElement("tr");
        table.appendChild(tr);
        for (let j = 0; j < 10; j++) {
            let td = document.createElement("td");
            let cell = univers[i][j];
            cell.dom = td;
            cell.initialiser();
            tr.appendChild(td);
        }
    }
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function atomesAleatoire() {
    let lignes = [];
    let colonnes = [];
    while (lignes.length < 5 || colonnes.length < 5) {
        var lig = Math.floor(Math.random() * 7) + 1;
        var col = Math.floor(Math.random() * 7) + 1;
        if (lignes.indexOf(lig) === -1) {
            lignes.push(lig);
        }
        if (colonnes.indexOf(col) === -1) {
            colonnes.push(col);
        }
    }
    for (let i = 0; i < 5; i++) {
        univers[lignes[i]][colonnes[i]].atome = true;
        univers[lignes[i]][colonnes[i]].dom.classList.add("atome");
    }
}

function creerUnivers() {
    var li, co, ligne;
    univers = [];
    for (li = 0; li < 10; li += 1) {
        ligne = [];
        for (co = 0; co < 10; co += 1) {
            ligne.push(new Cellule(li, co));
        }
        univers.push(ligne);
    }
}

function resultatDuTir(cellule, vl, vc) {
    var s = univers[cellule.li + vl][cellule.co + vc];
    if (!s.grille) {
        return s; // le rayon touche le bord
    }
    if (s.atome) {
        return null; // Absorption
    }
    if (vc === 0) {
        if (univers[s.li][s.co - 1].atome) {
            if (!cellule.grille) {
                return cellule;
            }
            return resultatDuTir(cellule, 0, 1);
        }
        if (univers[s.li][s.co + 1].atome) {
            if (!cellule.grille) {
                return cellule;
            }
            return resultatDuTir(cellule, 0, -1);
        }
    } else {
        if (univers[s.li - 1][s.co].atome) {
            if (!cellule.grille) {
                cellule.majCouleur(cellule.couleur);
                return cellule;
            }
            return resultatDuTir(cellule, 1, 0);
        }
        if (univers[s.li + 1][s.co].atome) {
            if (!cellule.grille) {
                return cellule;
            }
            return resultatDuTir(cellule, -1, 0);
        }
    }
    return resultatDuTir(s, vl, vc);
}

function validerOnClick() {
    if (ronds.length == 5) {
        let i = 0;
        while (i < 5 && ronds[i].atome) {
            i++;
        }
        score += (5 - i) * 5;
        if (i == 5) {
            win();
        } else {
            lose();
        }

    }
}
function debugOnClick() {
    let debugCheckBox = document.getElementById("debug");
    if (debugCheckBox.checked) {
        debug = true;
        for (let ligne of univers) {
            for (let cell of ligne) {
                if (cell.atome) {
                    cell.majCouleur("#f00");
                }
            }
        }
    } else {
        debug = false;
        for (let ligne of univers) {
            for (let cell of ligne) {
                if (cell.atome) {
                    cell.majCouleur("#fff");
                }
            }
        }
    }
}

function majScore() {
    document.getElementById("score").innerHTML = "Score : " + score;
}

function win() {
    alert("Vous avez gagné !");
    clearTab();
}

function lose() {
    alert("La combinaison n'est pas gagnante");
}

function clearTab() {
    let jeu = document.getElementById("jeu");
    while (jeu.firstChild) {
        jeu.removeChild(jeu.firstChild);
    }
    init();
}

setInterval(majScore, 100);
var univers;
var ronds;
var score;
var debug = false;

function init() {
    creerUnivers();
    tabCell();
    atomesAleatoire();
    score = 0;
    ronds = [];
}
