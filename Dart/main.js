let editMode = false;
const startPoints = 501;
let useConfirmation = true;
let inGame = false;


function stop() {
    if(inGame)
        customChoice("Do you want to stop the game?", function(yes) {
            if(yes)
                reset();
        });
}

function start() {
    if(document.getElementsByClassName("playerShowList")[0].children.length === 0) {
        customAlert("No players registered");
        return;
    }
    
    let x2, x3;
    document.getElementsByTagName("main")[0].setAttribute("style", "display: none;");
    for(i = 0; i < document.getElementsByClassName("playerShowList")[0].children.length; i++) {
        let name = document.getElementsByClassName("playerShowList")[0].children[i].children[0].innerHTML;
        document.getElementsByClassName("playersTurnList")[0].insertAdjacentHTML("beforeend", 
        `<div name="${name}" score="${startPoints}" currentRoundScore="0" throws="0" average="0" round="0" class="playerModel">
        <a class="playerName">${name}</a><a class="scoreRepresentation">${startPoints}</a></div>`);   
    }
    
    
    document.getElementsByTagName("main")[1].setAttribute("style", "display: flex;");
    console.log(document.querySelectorAll("td > div"));
    for(i = 0; i < document.querySelectorAll("td > div").length; i++) {
        var div = document.querySelectorAll("td > div")[i];
        
        if(i < document.querySelectorAll("td > div").length - 4)
            div.addEventListener("click", function(event) {
                if(!isSelected(event.target))   
                    deSelect(false);
                select(event.target);
            });
        else if(i < document.querySelectorAll("td > div").length - 2) {
            if(x2 === undefined)
                x2 = document.querySelectorAll("td > div")[i];
            else
                x3 = document.querySelectorAll("td > div")[i];

            div.addEventListener("click", function(event) {
                let arr = [...event.target.parentElement.parentElement.children];
                let idx = arr.indexOf(event.target.parentElement);
                if(idx === 2) 
                    arr[3].children[0].setAttribute("style", "");
                else if(idx === 3)
                    arr[2].children[0].setAttribute("style", "");
                
                select(event.target);
            });
        }
    }

    document.getElementsByClassName("save")[0].addEventListener("click", function() {
        lock(x2, x3);
    });
    document.getElementsByClassName("reset")[0].addEventListener("click", resetRound);


    inGame = true;
    customChoice("Use additional confirm window, when locking?", function(use) {
        useConfirmation = use;
    });
}

function calcScore(score) {
    let numScore;
    if(score.startsWith("D"))
        numScore = 2 * parseInt(score.substring(1));
    else if(score.startsWith("T"))
        numScore = 3 * parseInt(score.substring(1));
    return numScore;
}

function show(score) {
    let numScore = calcScore(score);
    let str;

    if(parseInt(score) != score)
        str = `Is ${score}(${numScore}) correct?`;
    else 
        str = `Is ${score} correct?`;

    if(numScore === undefined)
        numScore = parseInt(score);
    
    if(useConfirmation)
        customChoice(str, function(hasConfirmed) {
            if(hasConfirmed)
                calculate(numScore, score);
        });
    else
        calculate(numScore, score);
}

function calculate(numScore, score) {
    str = document.getElementsByClassName("display")[0].innerHTML == "" ? score: `, ${score}`;
    document.getElementsByClassName("display")[0].innerHTML += str;
    
    const player = document.getElementsByClassName("playerModel")[0];
    if(checkOverfly(player, numScore) !== 0)
        return;

    if(player.getAttribute("throws") === "2") {
        player.setAttribute("throws", "0");
        const round = parseInt(player.getAttribute("round"));
        player.setAttribute("average", (parseFloat(player.getAttribute("average")) * round + parseInt(player.getAttribute("currentroundscore")) + numScore) / (round + 1));
        player.setAttribute("round", round + 1);
        player.setAttribute("currentroundscore", parseInt(player.getAttribute("currentroundscore")) + numScore);
        player.setAttribute("score", parseInt(player.getAttribute("score")) - parseInt(player.getAttribute("currentroundscore")));
        next(player);
    }
    else {
        player.setAttribute("throws", parseInt(player.getAttribute("throws")) + 1);
        player.setAttribute("currentroundscore", parseInt(player.getAttribute("currentroundscore")) + numScore);
        document.getElementsByClassName("scoreRepresentation")[0].innerHTML = parseInt(player.getAttribute("score")) - 
        parseInt(player.getAttribute("currentroundscore"));
    }
}

function checkOverfly(player, numScore) {
    let difference = parseInt(player.getAttribute("score")) - parseInt(player.getAttribute("currentroundscore")) - numScore;
    //console.log(difference);
    if(difference === 0) {
        customAlert(`${player.getAttribute("name")} won`);
        reset();
        return 1;
    }
    else if(difference < 0) {
        player.setAttribute("throws", "0");
        player.setAttribute("currentroundscore", "0");
        next(player);
        return -1;
    }
    return 0;
}

function next(player) {
    //console.log("next player");
    let currentRoundScore = player.getAttribute("currentroundscore");
    player.setAttribute("currentroundscore", "0");
    document.getElementsByClassName("scoreRepresentation")[0].innerHTML = `${player.getAttribute("score")}`;

    let parent = player.parentElement;
    player.remove();
    parent.insertAdjacentElement("beforeend", player);
    document.getElementsByClassName("display")[0].innerHTML = "";
    //console.log(player.getAttribute("score")); 
    customAlert(`${currentRoundScore} made ${player.getAttribute("score")} to go`);
}

function isSelected(node) {
    return !(node.getAttribute("style") === null || node.getAttribute("style") === "");
}

function deSelect(all=true) {
    if(all)
    {
        for(i = 0; i < document.getElementsByTagName("tbody")[0].children.length; i++) {
            let tr = document.getElementsByTagName("tbody")[0].children[i];
            
            for(j = 0; j < tr.children.length; j++) {
                if(tr.children[j] === undefined || tr.children[j].children[0] === undefined)
                    continue;
                tr.children[j].children[0].setAttribute("style", "");
            }
        }
    }
    else {
        for(i = 0; i < document.getElementsByTagName("tbody")[0].children.length - 1; i++) {
            let tr = document.getElementsByTagName("tbody")[0].children[i];
            
            for(j = 0; j < tr.children.length; j++) {
                if(i === document.getElementsByTagName("tbody")[0].children.length - 2 && j === 1)
                    break;
                if(tr.children[j] === undefined || tr.children[j].children[0] === undefined)
                    continue;
                tr.children[j].children[0].setAttribute("style", "");
            }
        }
    }
}

function select(node) {
    if(!isSelected(node))
        node.setAttribute("style", "border: 2px solid #4CAF50;");
    else
        node.setAttribute("style", "");
}

function clickPlayer(player) {
    if(editMode)
        player.parentElement.remove();
    if(document.getElementsByClassName("playerShowList")[0].children.length === 0) {
        editMode = false;
        document.getElementsByClassName("removePlayer")[0].setAttribute("style", "");
    }
}

function addPlayer(username) {
    document.getElementsByClassName("playerShowList")[0].insertAdjacentHTML("beforeend", `<li id="${document.getElementsByClassName("playerShowList")[0].children.length}"><a class="button playerEditRepresentation">${username}</a></li>`);
    document.getElementById(document.getElementsByClassName("playerShowList")[0].children.length - 1).addEventListener("click", function(event) {
        clickPlayer(event.target);
    });
}

function customPrompt(caption, callback) {
    let div = document.createElement("div");
    div.classList.add("prompt");
    div.insertAdjacentHTML("afterbegin",    `<div><h1 class="caption">${caption}</h1><input spellcheck="false" name="username" type="text"><div class="row">
                                            <a class="confirm button">Confirm</a><a class="cancel button">Cancel</a></div></div>`);
    document.body.appendChild(div);
    document.getElementsByClassName("confirm")[0].addEventListener("click", function() {
        let input = document.getElementsByName("username")[0].value;
        if(input.replace(" ", "") !== "") {
            callback(input);
            div.remove();
        }
    });
    document.getElementsByClassName("cancel")[0].addEventListener("click", function() {
        div.remove();
    });
}

function customChoice(caption, callback) {
    let div = document.createElement("div");
    div.classList.add("prompt");
    div.insertAdjacentHTML("afterbegin",    `<div><h1 class="caption">${caption}</h1><div class="row"><a class="confirm button">Confirm</a>
                                            <a class="cancel button">Decline</a></div></div>`);
    document.body.appendChild(div);
    document.getElementsByClassName("cancel")[0].addEventListener("click", function() {
        div.remove();
        if(callback !== undefined)
            callback(false);
    });
    document.getElementsByClassName("confirm")[0].addEventListener("click", function() {
        div.remove();
        if(callback !== undefined)
            callback(true);
    });
}

function customAlert(caption) {
    let div = document.createElement("div");
    div.classList.add("prompt");
    div.insertAdjacentHTML("afterbegin", `<div><h1 class="caption">${caption}</h1><a class="cancelAlert button">Confirm</a></div>`);
    document.body.appendChild(div);
    document.getElementsByClassName("cancelAlert")[0].addEventListener("click", function() {
        div.remove();
    });
}

function reset() {
    document.getElementsByClassName("display")[0].innerHTML = "";
    document.getElementsByClassName("playersTurnList")[0].innerHTML = "";
    deSelect();
    let el = document.getElementsByTagName("main")[1];
    let clone = el.cloneNode(true);
    el.parentNode.replaceChild(clone, el);
    clone.setAttribute("style", "display: none;");
    document.getElementsByTagName("main")[0].setAttribute("style", "");
    inGame = false;
}

function lock(x2, x3) {
    let score = '0';
    
    for(i = 0; i < document.getElementsByTagName("tbody")[0].children.length - 1; i++) {
        let tr = document.getElementsByTagName("tbody")[0].children[i];
        
        for(j = 0; j < tr.children.length; j++) {
            if(i === document.getElementsByTagName("tbody")[0].children.length - 2 && j === 2)
                break;
            if(tr.children[j].children[0] === undefined)
                continue;
            if(isSelected(tr.children[j].children[0])) {
                score = tr.children[j].children[0].innerHTML;
                break;
            }
        }
    }

    if(isSelected(x2))
        score = "D" + score;
    else if(isSelected(x3))
        score = "T" + score;

    if(calcScore(score) > 60) {
        customAlert("T25 is not possible");
        return;
    }

    show(score);
    deSelect();
}

function resetRound() {
    let player = document.getElementsByClassName("playerModel")[0];
    player.setAttribute("currentroundscore", "0");
    player.setAttribute("throws", "0");
    document.getElementsByClassName("display")[0].innerHTML = "";
    document.getElementsByClassName("scoreRepresentation")[0].innerHTML = player.getAttribute("score");
}


document.getElementsByClassName("addPlayer")[0].addEventListener("click", function() {
    customPrompt("Please enter your name", addPlayer);
});

document.getElementsByClassName("removePlayer")[0].addEventListener("click", function() {
    if(document.getElementsByClassName("playerShowList")[0].children.length === 0)
        return;
    editMode = !editMode;
    if(editMode)
        document.getElementsByClassName("removePlayer")[0].setAttribute("style", "background-color: #502228;"); //#502228
    else 
        document.getElementsByClassName("removePlayer")[0].setAttribute("style", "");
});

document.getElementsByClassName("start")[0].addEventListener("click", start);


document.getElementsByTagName("header")[0].children[0].addEventListener("click", stop);
