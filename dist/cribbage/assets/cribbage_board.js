var CribPlayer = function (a) {
    this.playerID = a;
    this.backPegScore = -1;
    this.score = 0;
    this.playerName = "";
    this.frontPeg = {};
    this.backPeg = {}
}, p1 = new CribPlayer("p1"), p2 = new CribPlayer("p2"), players = {p1: p1, p2: p2};
CribPlayer.prototype.initialize = function () {
    for (var a = this.playerID, b = -1; 121 >= b; ++b) this[b] = $("." + a + '-dot[data-pt="' + b + '"]');
    this.playerName = $("#" + a + "-name").val();
    this.frontPeg = $("#" + a + "-peg-2");
    this.backPeg = $("#" + a + "-peg-1");
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
        $("#" + d + "-area .score").text(f);
        checkWin();
        c = {};
        c.playerID = this.playerID;
        c.oldBackPegScore = e;
        c.oldScore = b;
        c.scoreToAdd = a;
        c.newScore = f;
        c.isUndone = !1;
        this.backPeg.attr("data-pt", f);
        this.switchFrontPeg();
        this.backPegScore = b;
        addToHistoryList(c);
    }
    return this
};
CribPlayer.prototype.setTo = function (a, b) {
    var c = this.playerID;
    this.frontPeg.attr("data-pt", a);
    this.backPeg.attr("data-pt", b);
    this.switchFrontPeg();
    $("#" + c + "-area .score").text(b);
    121 == b && this[b].addClass("game-over").addClass(c + "-wins");
    this.backPegScore = a;
    this.score = b;
    checkWin();
    return this
};


var currentSkin, historyList = [], currentHistID, jsBlur = !1;
$(".undo-redo-btn").prop("disabled", !0);

// initialize skin by setting the radiobutton correctly
const initialSkin = localStorage.getItem('cribBoardSkin') ?? 'clear';
if('clear' === initialSkin) {
    document.querySelector('#clear-skin').setAttribute('checked','true')
} else {
    document.querySelector('#classic-skin').setAttribute('checked','true')
}

updateSkin();
p1.initialize();
p2.initialize();

$(".name-input").on("input", function () {
    var a = $(this), b = a.data("playerid"), a = escapeHtml(a.val()), a = a.replace(/[ ]/g, "&#8200;");
    $("#" + b + "-name-spacer").html(a)
}).keyup(function (a) {
    27 === a.which && $(this).closest("form").submit()
}).blur(function () {
    jsBlur || $(this).closest("form").submit()
});
$(".name-input-form").submit(function (a) {
    a.preventDefault();
    a = $(this).find(".name-input");
    var b = a.data("playerid"), c = a.val();
    0 == c.trim().length && (c = "Player " + ("p1" === b ? "One" : "Two"));
    players[b].playerName = c;
    jsBlur = !0;
    a.val(c).blur();
    jsBlur = !1;
    c = escapeHtml(c);
    $("#" + b + "-name-spacer").html(c);
    $(".history-entry." + b + " .player-name").html(c);
    $('label[for="' + b + '-deal"]').html(c);

});
$(".add-score").click(function () {
    var a = $(this), b = myParseInt(a.data("points"));
    ("p1" === a.data("playerid") ? p1 : p2).addScore(b)
});
$('input[name="skin"]').change(function () {
    updateSkin();
    localStorage.setItem('cribBoardSkin', currentSkin);
});
$("#history-undo").click(function () {
    undoAddScore()
});
$("#history-redo").click(function () {
    redoAddScore()
});
$(document).keydown(function (a) {
    $("input").is(":focus") || (a.ctrlKey && 90 == a.keyCode ? undoAddScore() : a.ctrlKey && 89 == a.keyCode && redoAddScore())
});


$('input[name="next-dealer"]').change(function () {

});

function checkWin() {
    var a, b, c = !1;
    121 == p1.score ? (a = p1, b = p2, c = !0) : 121 == p2.score && (a = p2, b = p1, c = !0);
    c ? ($("#" + a.playerID + "-area .score").addClass("winner"), 91 > b.score && (a = $("#" + b.playerID + "-area"), a.addClass("skunked"), 61 > b.score && a.addClass("doubleskunked"))) : ($(".score.winner").removeClass("winner"), $(".skunked").removeClass("skunked"), $(".doubleskunked").removeClass("doubleskunked"))
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
    $(".no-history").remove();
    $historyListEl = $("#history-list");
    $historyListEl.animate({scrollTop: 0}, 250);
    var b = a.playerID,
        c = '<span class="hist-score">+' + a.scoreToAdd + '</span> &nbsp;<span class="player-name">' + escapeHtml(players[b].playerName) + "</span>",
        b = $("<p>", {id: "hist-" + currentHistID}).addClass("history-entry").addClass(b).html(c);
    a.isUndone && b.addClass("undone");
    b.prependTo($historyListEl).hide().fadeIn("fast");
    $("#history-undo").prop("disabled", !1);
    $("#history-redo").prop("disabled", !0)
}

function clearUndone() {
    for (; 0 < historyList.length && historyList[historyList.length - 1].isUndone;) historyList.splice(-1);
    $(".history-entry.undone").slideUp("fast", function () {
        $(this).remove()
    })
}

function undoAddScore() {
    var a = $("#history-undo");
    $icon = $("#undo-icon");
    $icon.remove();
    $newIcon = $icon.clone().addClass("spin").appendTo(a);
    for (var b = !0, c; b;) c = historyList[currentHistID], c.isUndone ? 0 < currentHistID ? --currentHistID : b = !1 : (players[c.playerID].setTo(c.oldBackPegScore, c.oldScore), $("#hist-" + currentHistID).addClass("undone"), c.isUndone = !0, b = !1);

    0 == currentHistID && a.prop("disabled", !0);
    $("#history-redo").prop("disabled", !1);
    scrollHist()
}

function redoAddScore() {
    var a = $("#history-redo");
    $icon = $("#redo-icon");
    $icon.remove();
    $newIcon = $icon.clone().addClass("spin").appendTo(a);
    historyList[currentHistID].isUndone && (a = historyList[currentHistID], players[a.playerID].setTo(a.oldScore, a.newScore), $("#hist-" + currentHistID).removeClass("undone"), historyList[currentHistID].isUndone = !1, currentHistID + 1 < historyList.length ? ++currentHistID : $("#history-redo").prop("disabled", !0));

    $("#history-undo").prop("disabled", !1);
    scrollHist()
}

function scrollHist() {
    if (0 < currentHistID) {
        var a = $("#hist-" + (currentHistID - 1)), b = a.position().top, a = b + a.innerHeight(),
            c = $("#history-list"), d = c.scrollTop(), e = c.height();
        0 > b ? c.animate({scrollTop: d + b - 24}, 250) : a > e && c.animate({scrollTop: d + (b - e) + 24}, 250)
    }
}


function escapeHtml(a) {
    var b = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"};
    return a.replace(/[&<>"']/g, function (a) {
        return b[a]
    })
}

