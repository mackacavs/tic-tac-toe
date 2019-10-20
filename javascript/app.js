//Create state object to determinte whether game is being played or not
const gamePlaying = { state: true, numbOfTurns: 0 }

//Cache the DOM to save work for computer later
const cachedDOM = {
    restartGameDiv: document.querySelector(".restartGame"),
    container: document.querySelector(".container"),
    form: document.querySelector(".form-group"),
    restartGameBtn: document.getElementById("restartGame"),
    startGameBtn: document.getElementById("startGame"),
    firstPlayer: document.getElementById("firstPlayer"),
    secondPlayer: document.getElementById("secondPlayer")
};

const appController = (function () {

    const gameCenter = function (players) {
        cachedDOM.container.addEventListener("click", function (e) {
            //Check that targeted grid has not already been clicked and that the game is being played
            if (e.target.textContent === "" && gamePlaying.state === true) {
                for (let player of players) {
                    if (player.active === true) {
                        UI.addXorO(e, player);
                        playerData.checkForWin(player);
                        player.active = !player.active
                    } else {
                        player.active = !player.active
                        UI.updateActivePlayer(player);
                    }
                }
                gamePlaying.numbOfTurns++
            }

            //Check for draw
            if (gamePlaying.numbOfTurns === 9 && gamePlaying.state === true) {
                UI.userMessage("It's A Draw!");
                UIPlayer = document.querySelector(".UIUpdate")
                UIPlayer.remove();
                gamePlaying.state = false;
            }

            e.preventDefault();
        });
    }

    return { gameCenter }

})();

const UI = (function () {

    // Add grids to the HTML
    const populateCont = function () {
        for (let i = 0; i < 9; i++) {
            let indiBox = document.createElement('div');
            indiBox.className = "grid-item"
            indiBox.id = i;
            cachedDOM.container.appendChild(indiBox);
        }
        cachedDOM.restartGameBtn.textContent = "";
    }

    // Adds X or 0 to the relative grid
    const addXorO = function (e, player) {

        let enteredValue = document.createElement('h2');
        let indiBox = document.getElementById(e.target.id);
        enteredValue.textContent = player.marker;
        indiBox.appendChild(enteredValue)
    }

    const div = document.createElement("div");

    // Adds active player div in UI
    const createActivePlayer = function (players) {

        div.classList.add("UIUpdate")
        const mainBox = cachedDOM.container;
        div.textContent = `It's ${players[0].name}'s Turn`
        mainBox.insertAdjacentElement("beforeend", div);
    }

    // Updates active player div
    const updateActivePlayer = function (player) {

        div.textContent = `It's ${player.name}'s Turn`
    }

    // Creates user message when game is won, drawn or user needs to enter usernames
    const userMessage = function (text) {
        const message = document.createElement("div");
        message.classList.add("UIMessage");
        message.textContent = text;

        cachedDOM.restartGameDiv.parentNode.insertBefore(message, cachedDOM.restartGameDiv)
    }

    return { addXorO, createActivePlayer, updateActivePlayer, populateCont, userMessage }

})();

const playerData = (function () {

    // Checks to see if there is a winner
    const checkForWin = function (player) {

        const winningCombs = [[0, 1, 2],
        [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7],
        [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        if (winningCombs.some((element) => {
            return document.getElementById(element[0]).textContent === player.marker &&
                document.getElementById(element[1]).textContent === player.marker &&
                document.getElementById(element[2]).textContent === player.marker
        })) {
            UI.userMessage(`${player.name} wins!`)
            gamePlaying.state = false;
            UIPlayer = document.querySelector(".UIUpdate")
            UIPlayer.remove();
        } else {
            return false
        }
    }

    return { checkForWin }

})();

const setUpButtons = (function () {

    cachedDOM.startGameBtn.addEventListener("click", function (e) {

        const player1Name = cachedDOM.firstPlayer.value;
        const player2Name = cachedDOM.secondPlayer.value;
        if (player1Name && player2Name) {
            //Create player constructors
            class playerConstructor {
                constructor(name, marker, active) {
                    this.name = name;
                    this.marker = marker;
                    this.active = active
                }
            }

            let players = [];
            const player1 = new playerConstructor(player1Name, "X", true);
            const player2 = new playerConstructor(player2Name, "O", false);
            players.push(player1, player2);
            cachedDOM.form.style.display = "none";
            cachedDOM.restartGameBtn.textContent = "Restart Game?";

            appController.gameCenter(players);
            UI.createActivePlayer(players);

        } else {

            //Warn the user if they haven't entered the player's names
            UI.userMessage("Please enter the player's names");
            const warningAlert = document.querySelector(".UIMessage");
            setTimeout(() => warningAlert.remove(), 1000);
        }
        e.preventDefault();
    });

    cachedDOM.restartGameBtn.addEventListener("click", function (e) {
        window.location.reload();
    });

})();

UI.populateCont();
