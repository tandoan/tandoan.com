class Game {
    constructor() {
        this.skin = 'clear';
        this.historyList = [];
        this.currentHistID = undefined;
        this.players = {p1: undefined, p2: undefined}
        this.p1 = undefined;
        this.p2 = undefined;
    }

    reset() {
        this.historyList = []
        this.currentHistID = undefined;
        this.currentHistID = undefined;
        this.players = {p1: undefined, p2: undefined}
        this.p1 = undefined;
        this.p2 = undefined;

        const p1 = new CribPlayer("p1");
        const p2 = new CribPlayer("p2");
        this.players = {p1: p1, p2: p2};
        this.p1 = p1;
        this.p2 = p2;

        p1.initialize()
        p2.initialize();
        p1.setGame(this);
        p2.setGame(this);

        // update ui
        // scores
        document.querySelectorAll('.score').forEach((each) => each.replaceChildren(document.createTextNode('0')))
        // history
        const p = document.createElement('p');
        p.classList.add('no-history');
        p.appendChild(document.createTextNode('(none)'))

        document.querySelector('#history-list').replaceChildren(p)
        document.querySelector('.undo-redo-btn').setAttribute('disabled', 'disabled')

        document.querySelector('#p1-peg-1').dataset.pt = '-1';
        document.querySelector('#p1-peg-2').dataset.pt = '0';
        document.querySelector('#p2-peg-1').dataset.pt = '-1';
        document.querySelector('#p2-peg-2').dataset.pt = '0';

        this.resetWinnerUI();
    }

    resetWinnerUI() {
        document.querySelector('.score.winner')?.classList.remove('winner')
        document.querySelector('.skunked')?.classList.remove('skunked')
        document.querySelector('.doubleskunked')?.classList.remove('doubleskunked')
    }

    checkWin() {
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
            this.resetWinnerUI();
        }
    }

    redoAddScore() {
        if (this.historyList[this.currentHistID].isUndone) {
            const a = this.historyList[this.currentHistID];
            this.players[a.playerID].setTo(a.oldScore, a.newScore);
            document.querySelector(`#hist-${this.currentHistID}`).classList.remove('undone')
            this.historyList[this.currentHistID].isUndone = false;
            if (this.currentHistID + 1 < this.historyList.length) {
                ++this.currentHistID
            } else {
                document.querySelector('#history-redo').setAttribute('disabled', 'disabled')
            }
        }

        document.querySelector('#history-undo').removeAttribute('disabled');
    }

    undoAddScore() {
        const undoElem = document.querySelector('#history-undo');
        for (var b = true, c; b;) {
            c = this.historyList[this.currentHistID];
            if (c.isUndone) {
                0 < this.currentHistID
                    ? --this.currentHistID
                    : b = false
            } else {
                this.players[c.playerID].setTo(c.oldBackPegScore, c.oldScore);
                document.querySelector(`#hist-${this.currentHistID}`).classList.add('undone')
                c.isUndone = true;
                b = false;
            }
        }

        if (0 === this.currentHistID) {
            undoElem.setAttribute('disabled', 'disabled')
        }
        document.querySelector('#history-redo').removeAttribute('disabled');
    }

    clearUndone() {
        for (; 0 < this.historyList.length && this.historyList[this.historyList.length - 1].isUndone;) this.historyList.splice(-1);
        document.querySelectorAll(`.history-entry.undone`).forEach(each => each.remove())
    }

    updateSkin() {
        var a = document.querySelector('input[name="skin"]:checked').value
        theGame.skin = a;
        var b = document.querySelector('#cribbage-board')
        b.classList.remove('classic');
        if ("classic" === a) {
            var c = 0, a = ["/cribbage/assets/img/classic.jpg", "/cribbage/assets/img/peg_shadow.png"];
            var imageCount = a.length;
            var imagesArray = [];
            for (var d = 0; d < imageCount; ++d) imagesArray[d] = new Image, imagesArray[d].onload = function () {
                ++c;
                c >= imageCount && b.classList.add("classic")
            }, imagesArray[d].src = a[d]
        }
    }

    addToHistoryList(a) {
        this.historyList.push(a);
        this.currentHistID = this.historyList.length - 1;
        document.querySelector('.no-history')?.remove();
        const historyListEl = document.querySelector('#history-list');
        const playerID = a.playerID;
        const innerThings = [];
        let tmp = document.createElement('span');
        tmp.appendChild(document.createTextNode(a.scoreToAdd));
        tmp.classList.add('hist-score');
        innerThings.push(tmp);

        tmp = document.createElement('span')
        tmp.appendChild(document.createTextNode(this.players[playerID].playerName));
        innerThings.push(tmp);

        let outer = document.createElement('p')
        outer.setAttribute('id', `hist-${this.currentHistID}`);
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
}

var CribPlayer = function (a) {
    this.playerID = a;
    this.backPegScore = -1;
    this.score = 0;
    this.playerName = "";
    this.frontPeg = {};
    this.backPeg = {}
};

CribPlayer.prototype.setGame = function (g) {
    this.game = g;
}
CribPlayer.prototype.initialize = function () {
    this.playerName = document.querySelector(`#${this.playerID}-name`).value;
    this.frontPeg = document.querySelector(`#${this.playerID}-peg-2`);
    this.backPeg = document.querySelector(`#${this.playerID}-peg-1`);

    return this
};
CribPlayer.prototype.otherPlayer = function () {
    var a = this.game.p2;
    "p2" === this.playerID && (a = this.game.p1);
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
        this.game.clearUndone();
        var d = this.playerID, e = this.backPegScore, f = b + a;
        121 <= f && (f = 121, 121 == c && (f = 120));
        this.score = f;
        document.querySelector(`#${d}-area .score`).replaceChildren(document.createTextNode(f))
        this.game.checkWin();
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
        this.game.addToHistoryList(c);
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
    this.game.checkWin();
    return this
};


// initialize skin by setting the radiobutton correctly
// We're working a little backwards here -- the source of truth is in the dom, not the game object
// Set the dom, then Game.updateSkin() reads from the dom and updates game state.
const initialSkin = localStorage.getItem('cribBoardSkin') ?? 'clear';
if ('clear' === initialSkin) {
    document.querySelector('#clear-skin').setAttribute('checked', 'true')
} else {
    document.querySelector('#classic-skin').setAttribute('checked', 'true')
}


const theGame = new Game();
theGame.updateSkin();
const initializeAllThings = () => {
    const p1 = new CribPlayer("p1");
    const p2 = new CribPlayer("p2");
    theGame.players = {p1: p1, p2: p2};
    theGame.p1 = p1;
    theGame.p2 = p2;

    p1.initialize()
    p2.initialize();
    p1.setGame(theGame);
    p2.setGame(theGame);
}

initializeAllThings();


document.querySelector('.undo-redo-btn').setAttribute('disabled', 'disabled')

document.querySelectorAll('.score-buttons').forEach((each) => each.addEventListener('click', (e, t2) => {
    let b = myParseInt(e.target.dataset.points);
    (("p1" === e.target.dataset.playerid) ? theGame.p1 : theGame.p2).addScore(b);
}));
document.querySelectorAll('input[name="skin"]').forEach((each) => each.addEventListener('change', () => {
    theGame.updateSkin();
    localStorage.setItem('cribBoardSkin', theGame.skin);
}));

document.querySelector('#history-undo').addEventListener('click', () => {
    theGame.undoAddScore()
})
document.querySelector('#history-redo').addEventListener('click', () => {
    theGame.redoAddScore()
})

document.querySelector('#new-game-btn').addEventListener('click', () => {
    theGame.reset()
})

const myParseInt = (a) => {
    a = parseInt(a, 10);
    isNaN(a) && (a = 0);
    return a
}
