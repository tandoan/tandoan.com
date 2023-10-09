class Game {
    set player1(p) {
        this.p1 = p;
    }

    set player2(p) {
        this.p2 = p;
    }

    checkWin() {
        var a, b, c = !1;
        let winner;
        let loser;
        let haveWinner = false;

        if (this.p1.score >= 121) {
            winner = this.p1;
            loser = this.p2;
            haveWinner = true;
        } else if (this.p2.score >= 121) {
            winner = this.p2;
            loser = this.p1;
            haveWinner = true;
        }
        if (haveWinner) {
            document.querySelector(`#${winner.playerID}-area .score`).classList.add('winner');
            if (91 > loser.score) {
                document.querySelector(`#${loser.playerID}-area`).classList.add('skunked');
            }
            if (61 > loser.score) {
                document.querySelector(`#${loser.playerID}-area`).classList.add('doubleskunked');
            }
        } else {
            document.querySelector('.score.winner')?.classList.remove('winner')
            document.querySelector('.skunked')?.classList.remove('sknunked')
            document.querySelector('.doubleskunked')?.classList.remove('doubleskunked')
        }
    }
}

var CribPlayer = function (a) {
    this.playerID = a;
    this.backPegScore = -1;
    this.score = 0;
    this.playerName = "";
    this.frontPeg = {};
    this.backPeg = {}
};
var p1, p2, players;

CribPlayer.prototype.initialize = function () {
    this.playerName = document.querySelector(`#${this.playerID}-name`).value;
    this.frontPeg = document.querySelector(`#${this.playerID}-peg-2`);
    this.backPeg = document.querySelector(`#${this.playerID}-peg-1`);

    return this
};
CribPlayer.prototype.otherPlayer = function () {
    var a = p2;
    "p2" === this.playerID && (a = p1);
    return a
};
CribPlayer.prototype.switchFrontPeg = function () {
    var a = this.frontPeg;
    this.frontPeg = this.backPeg;
    this.backPeg = a;
};
CribPlayer.prototype.addScore = function (a) {
    var b = this.score, c = this.otherPlayer().score;
    if (121 != b && (120 != b || 121 != c)) {
        clearUndone();
        var d = this.playerID, e = this.backPegScore, f = b + a;
        121 <= f && (f = 121, 121 == c && (f = 120));
        this.score = f;
        document.querySelector(`#${d}-area .score`).replaceChildren(document.createTextNode(f))
        checkWin();
        c = {};
        c.playerID = this.playerID;
        c.oldBackPegScore = e;
        c.oldScore = b;
        c.scoreToAdd = a;
        c.newScore = f;
        c.isUndone = !1;
        this.backPeg.setAttribute('data-pt', f)
        this.switchFrontPeg();
        this.backPegScore = b;
        addToHistoryList(c);
    }
    return this
};
CribPlayer.prototype.setTo = function (a, b) {
    var c = this.playerID;
    this.frontPeg.setAttribute('data-pt', a)
    this.backPeg.setAttribute('data-pt', b)
    this.switchFrontPeg();
    document.querySelector("#" + c + "-area .score").replaceChildren(document.createTextNode(b))
    this.backPegScore = a;
    this.score = b;
    checkWin();
    return this
};


var currentSkin, historyList = [], currentHistID, jsBlur = !1;
document.querySelector('.undo-redo-btn').setAttribute('disabled','disabled')

// initialize skin by setting the radiobutton correctly
const initialSkin = localStorage.getItem('cribBoardSkin') ?? 'clear';
if ('clear' === initialSkin) {
    document.querySelector('#clear-skin').setAttribute('checked', 'true')
} else {
    document.querySelector('#classic-skin').setAttribute('checked', 'true')
}

updateSkin();
const initializePlayers = () => {
    p1 = new CribPlayer("p1");
    p2 = new CribPlayer("p2");
    players = {p1: p1, p2: p2};
    p1.initialize()
    p2.initialize();
}

initializePlayers();
const theGame = new Game();
theGame.p1 = p1;
theGame.p2 = p2;

// $(".name-input").on("input", function () {
//     var a = $(this), b = a.data("playerid"), a = escapeHtml(a.val()), a = a.replace(/[ ]/g, "&#8200;");
//     $("#" + b + "-name-spacer").html(a)
// })

// $(".name-input-form").submit(function (a) {
//     a.preventDefault();
//     a = $(this).find(".name-input");
//     var b = a.data("playerid"), c = a.val();
//     0 == c.trim().length && (c = "Player " + ("p1" === b ? "One" : "Two"));
//     players[b].playerName = c;
//     jsBlur = !0;
//     a.val(c).blur();
//     jsBlur = !1;
//     c = escapeHtml(c);
//     $("#" + b + "-name-spacer").html(c);
//     $(".history-entry." + b + " .player-name").html(c);
//     $('label[for="' + b + '-deal"]').html(c);
//
// });
document.querySelectorAll('.score-buttons').forEach((each) => each.addEventListener('click', (e, t2) => {
    let b = myParseInt(e.target.dataset.points);
    (("p1" === e.target.dataset.playerid) ? p1 : p2).addScore(b);
}));
document.querySelectorAll('input[name="skin"]').forEach((each) => each.addEventListener('change', () => {
    updateSkin();
    localStorage.setItem('cribBoardSkin', currentSkin);
}));

document.querySelector('#history-undo').addEventListener('click', () => {
    undoAddScore()
})
document.querySelector('#history-redo').addEventListener('click', () => {
    redoAddScore()
})


function checkWin() {
    return theGame.checkWin()
}

function myParseInt(a) {
    a = parseInt(a, 10);
    isNaN(a) && (a = 0);
    return a
}

function updateSkin() {
    var a = document.querySelector('input[name="skin"]:checked').value
    currentSkin = a;
    var b = document.querySelector('#cribbage-board')
    b.classList.remove('classic');
    if ("classic" === a) {
        var c = 0, a = ["/cribbage/assets/img/classic.jpg", "/cribbage/assets/img/peg_shadow.png"];
        imageCount = a.length;
        imagesArray = [];
        for (var d = 0; d < imageCount; ++d) imagesArray[d] = new Image, imagesArray[d].onload = function () {
            ++c;
            c >= imageCount && b.classList.add("classic")
        }, imagesArray[d].src = a[d]
    }
}

function addToHistoryList(a) {
    historyList.push(a);
    currentHistID = historyList.length - 1;
    document.querySelector('.no-history')?.remove();
    const historyListEl = document.querySelector('#history-list');
    const playerID = a.playerID;
    const innerThings = [];
    let tmp = document.createElement('span');
    tmp.appendChild(document.createTextNode(a.scoreToAdd));
    tmp.classList.add('hist-score');
    innerThings.push(tmp);

    tmp = document.createElement('span')
    tmp.appendChild(document.createTextNode(players[playerID].playerName));
    innerThings.push(tmp);

    let outer = document.createElement('p')
    outer.setAttribute('id', `hist-${currentHistID}`);
    outer.classList.add('history-entry')
    outer.classList.add(playerID)
    innerThings.forEach(each => outer.appendChild(each))

    if (a.isUndone) {
        outer.classList.add('undone')
    }

    historyListEl.prepend(outer)
    document.querySelector("#history-undo").removeAttribute('disabled');
    document.querySelector("#history-redo").setAttribute('disabled', 'disabled')
}

function clearUndone() {
    for (; 0 < historyList.length && historyList[historyList.length - 1].isUndone;) historyList.splice(-1);
    document.querySelectorAll(`.history-entry.undone`).forEach(each => each.remove())
}


function undoAddScore() {
    const undoElem = document.querySelector('#history-undo');
    for (var b = true, c; b;) {
        c = historyList[currentHistID];
        if (c.isUndone) {
            0 < currentHistID
                ? --currentHistID
                : b = false
        } else {
            players[c.playerID].setTo(c.oldBackPegScore, c.oldScore);
            document.querySelector(`#hist-${currentHistID}`).classList.add('undone')
            c.isUndone = true;
            b = false;
        }
    }

    if (0 === currentHistID) {
        undoElem.setAttribute('disabled', 'disabled')
    }
    document.querySelector('#history-redo').removeAttribute('disabled');
}

function redoAddScore() {
    if (historyList[currentHistID].isUndone) {
        const a = historyList[currentHistID];
        players[a.playerID].setTo(a.oldScore, a.newScore);
        document.querySelector(`#hist-${currentHistID}`).classList.remove('undone')
        historyList[currentHistID].isUndone = false;
        if (currentHistID + 1 < historyList.length) {
            ++currentHistID
        } else {
            document.querySelector('#history-redo').setAttribute('disabled', 'disabled')
        }
    }

    document.querySelector('#history-undo').removeAttribute('disabled');
}


function escapeHtml(a) {
    var b = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"};
    return a.replace(/[&<>"']/g, function (a) {
        return b[a]
    })
}

