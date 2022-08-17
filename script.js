const game = (() => {

    // settings module

    const settings = (() => {

        let opponent;
        let bestOf;
        let player1;
        let player2;
        let firstMove;

        (() => {
            // set default settings 

            opponent = 'player';
            bestOf = 3;
            player1 = {
                name: 'Player 1',
                symbol: 'x',
                color: '#ea1a4b',
                score: 0,
            };
            player2 = {
                name: 'Player 2',
                symbol: 'o',
                color: '#fbd12f',
                score: 0,
            };
            firstMove = player1;

            // disabling player 2 name if opponent is computer

            let inputsOpponent = document.querySelector('.settings__options_opponent');
            inputsOpponent.addEventListener('click', (e) => {
                let inputPlayer2Name = document.querySelector('#input-p2-name');
                if (e.target.closest('.input_opponent_player') !== null) {
                    inputPlayer2Name.disabled = false;
                    inputPlayer2Name.value = '';
                } else if (e.target.closest('.input_opponent_computer') !== null) {
                    inputPlayer2Name.disabled = true;
                    inputPlayer2Name.value = 'Computer';
                }
            });

            // increase and decrease buttons for number of rounds 

            let inputRounds = document.querySelector('.input_rounds');

            const increaseRounds = () => {
                inputRounds.value = Math.min( (+inputRounds.value + 1), 9);
            };

            const decreaseRounds = () => {
                inputRounds.value = Math.max( (+inputRounds.value - 1), 1);
            };

            let roundsBlock = document.querySelector('.input_rounds-container');
            roundsBlock.addEventListener('click', (e) => {
                let target = e.target;
                if (target.closest('.input_rounds-btn_inc') !== null) {
                    increaseRounds();
                } else if (target.closest('.input_rounds-btn_dec') !== null) {
                    decreaseRounds();
                }
            });

            // toggle opposite symbol

            let player1SymbolX = document.querySelector('#input-p1-symbol-x');
            let player1SymbolO = document.querySelector('#input-p1-symbol-o');
            let player2SymbolX = document.querySelector('#input-p2-symbol-x');
            let player2SymbolO = document.querySelector('#input-p2-symbol-o');

            // make map for opposite elements

            let symbolMap = new Map();
            symbolMap.set(player1SymbolX, player2SymbolO);
            symbolMap.set(player1SymbolO, player2SymbolX);
            symbolMap.set(player2SymbolX, player1SymbolO);
            symbolMap.set(player2SymbolO, player1SymbolX);

            // add event listeners for radio buttons

            let allSymbols = document.querySelectorAll('.input_symbol');
            allSymbols.forEach(symbol => {
                symbol.addEventListener('click', (e) => {
                    symbolMap.get(e.target).checked = true;
                });
            });

            // 

            const createColorPalette = (e) => {
                let playerColorSettings = e.currentTarget;
                let playerInputColor = e.target;

                let paletteTemplate = document.querySelector('#template-palette').content.cloneNode(true);
                let palette = paletteTemplate.querySelector('.settings__colors-palette');

                let opponentColorSettings = Array.from(document.querySelectorAll('.settings__colors')).find( block => block !== e.currentTarget);
                let opponentInputColor = opponentColorSettings.querySelector('.input_color');
                let opponentPalette = opponentColorSettings.querySelector('.settings__colors-palette');

                let disabledCell = palette.querySelector(`.settings__colors-cell[background="${opponentInputColor.value}"]`);
                disabledCell.disabled = true;

                palette.addEventListener('click', (e) => {
                    if (e.target.closest('.settings__colors-cell') !== null) {
                        playerInputColor.value = e.target.getAttribute('background');
                        opponentPalette = opponentColorSettings.querySelector('.settings__colors-palette');
                        if (opponentPalette !== null) {
                            let currentOpponentDisabledCell = opponentPalette.querySelector('.settings__colors-cell[disabled]');
                            currentOpponentDisabledCell.disabled = false;
                            let opponentDisabledCell = opponentPalette.querySelector(`.settings__colors-cell[background="${playerInputColor.value}"]`);
                            opponentDisabledCell.disabled = true;
                        }
                    }
                });

                playerColorSettings.appendChild(palette);
            };

            const showPlayerPalette = (e) => {
                let playerColorSettings = e.currentTarget;
                let palette = playerColorSettings.querySelector('.settings__colors-palette');
                if (palette === null) {
                    createColorPalette(e);
                    palette = playerColorSettings.querySelector('.settings__colors-palette');
                }
                palette.classList.add('settings__colors-palette_active');
            };

            // add event listener to colors block 

            let playerColors = document.querySelectorAll('.settings__colors');
            playerColors.forEach(block => {
                block.addEventListener('click', (e) => {
                    if (e.target.closest('.input_color') !== null) {
                        e.preventDefault();
                        showPlayerPalette(e);
                    }
                });
            });

            // hide pallets when click anywhere outside them 

            document.addEventListener('click', (e) => {
                if (e.target.closest('.input_color') === null && e.target.closest('.settings__colors-palette') === null) {
                    let palettes = document.querySelectorAll('.settings__colors-palette');
                    palettes.forEach(palette => {
                        palette.classList.remove('settings__colors-palette_active');
                    });
                }
            });

        })();

        const Player = (name, symbol, color, score = 0) => {
            return {name, symbol, color, score};
        };

        const closeOpenSettings = () => {
            let settingsBlock = document.querySelector('.settings');
            settingsBlock.classList.toggle('settings_active');
        };

        const resetSettings = () => {
            let inputOpponentPlayer = document.querySelector('.input_opponent_player');
            inputOpponentPlayer.checked = true;

            let inputRounds = document.querySelector('.input_rounds');
            inputRounds.value = 3;

            let inputsPlayersNames = document.querySelectorAll('.input_name');
            inputsPlayersNames.forEach( input => {
                input.value = '';
                input.disabled = false;
            } );

            let inputPlayer1SymbolX = document.querySelector('#input-p1-symbol-x');
            inputPlayer1SymbolX.checked = true;

            let inputPlayer1Color = document.querySelector('#input-p1-color');
            inputPlayer1Color.value = '#ea1a4b';

            let inputPlayer2SymbolO = document.querySelector('#input-p2-symbol-o');
            inputPlayer2SymbolO.checked = true;

            let inputPlayer2Color = document.querySelector('#input-p2-color');
            inputPlayer2Color.value = '#fbd12f';
        };

        const applySettings = () => {
            opponent = document.querySelector('.input_opponent:checked').value;
            bestOf = +document.querySelector('.input_rounds').value;

            let player1Name = document.querySelector('#input-p1-name').value || 'Player 1';
            let player1Symbol = document.querySelector('.input_symbol[name="p1-symbol"]:checked').value;
            let player1Color = document.querySelector('#input-p1-color').value;

            player1 = Player(player1Name, player1Symbol, player1Color);
            
            let player2Name = (opponent === 'player' ? document.querySelector('#input-p2-name').value : 'Computer') || 'Player 2';
            let player2Symbol = document.querySelector('.input_symbol[name="p2-symbol"]:checked').value;
            let player2Color = document.querySelector('#input-p2-color').value;
            
            player2 = Player(player2Name, player2Symbol, player2Color);
            
            firstMove = [player1, player2].find(player => player.symbol === 'x');

            closeOpenSettings();
        };

        const getSettings = () => {
            return {opponent, bestOf, player1, player2, firstMove};
        };

        return {closeOpenSettings, resetSettings, applySettings, getSettings};
    })();

    const {closeOpenSettings, resetSettings, getSettings} = settings;

    // game board module

    const gameBoard = (() => {
        let board = [0,0,0,0,0,0,0,0,0];

        const defineCurrentPlayer = () => {
            let countOfSymbols = board.reduce( (obj, symbol) => {
                obj[symbol]++;
                return obj;
            }, {'x': 0, 'o': 0, '0': 0} );
            if (countOfSymbols['0'] === 9) return getSettings().firstMove;
            let players = [getSettings().player1, getSettings().player2];
            let nextSymbol = countOfSymbols.x === countOfSymbols.o ? 'x' : 'o';

            return players.find( player => player.symbol === nextSymbol);
        };

        const computerMakeMove = () => {
            let currentPlayer  = defineCurrentPlayer();
            if (getSettings().opponent === 'computer' && currentPlayer.name !== 'Computer') return;
            let possibleMoves = [...board].map( (item,i) => item === 0 ? i : '' ).filter( item => item !== '');
            if (possibleMoves.length === 0) return;
            let cellNum = possibleMoves[ Math.floor(Math.random() * possibleMoves.length ) ];
            let cell = document.querySelector(`.gameboard__cell[number="${cellNum}"]`);
            let computerMove = document.createElement('span');
            computerMove.classList.add('gameboard__cell-value');
            computerMove.textContent = getSettings().player2.symbol;
            computerMove.style.color = getSettings().player2.color;
            cell.appendChild(computerMove);
            board[cellNum] = computerMove.textContent;
        }

        const playerMakeMove = (e) => {
            if (board.find( symbol => symbol === 0 ) === undefined || e.target.closest('.gameboard__cell').children.length !== 0) return;
            let currentPlayer  = defineCurrentPlayer();
            if (getSettings().opponent === 'computer' && currentPlayer.name === 'Computer') return;
            let cell = e.target;
            let playerMove = document.createElement('span');
            playerMove.classList.add('gameboard__cell-value');
            playerMove.textContent = currentPlayer.symbol;
            playerMove.style.color = currentPlayer.color;
            cell.appendChild(playerMove);
            board[cell.getAttribute('number')] = playerMove.textContent;
        };

        const checkWinner = () => {

            let boardSplice = [board.slice(0,3), board.slice(3,6), board.slice(6,9)];

            for (let i = 0; i < 3; i++) {
            
                for (let j = 0, start = boardSplice[0][i], res = []; j < 3; j++) {
                    res.push( j * 3 + i );
                    if (boardSplice[j][i] !== start || boardSplice[j][i] === 0) break;
                    if (j === 2) {
                        if (boardSplice[j][i] === start) return {winner: start, res};
                    }
                }
                
                for (let j = 0, start = boardSplice[i][0], res = []; j < 3; j++) {
                    res.push( i * 3 + j );
                    if (boardSplice[i][j] !== start || boardSplice[i][j] === 0) break;
                    if (j === 2) {
                        if (boardSplice[i][j] === start) return {winner: start, res};
                    }
                }
                
            }
            
            for (let i = 0, j = 0, start = boardSplice[0][0], res = []; i < 3; i++, j++) {
                res.push( i * 3 + j );
                if (boardSplice[i][j] !== start || boardSplice[i][j] === 0) break;
                if (i === 2 && j === 2) {
                    if (boardSplice[i][j] === start) return {winner: start, res};
                }
            }
            
            for (let i = 0, j = 2, start = boardSplice[0][2], res = []; i < 3; i++, j--) {
                res.push( i * 3 + j );
                if (boardSplice[i][j] !== start || boardSplice[i][j] === 0) break;
                if (i === 2 && j === 0) {
                    if (boardSplice[i][j] === start) return {winner: start, res};
                }
            }
                
            if (boardSplice.some(row => row.toString().includes('0'))) return 'not finished';
            
            return 'tie';
        };

        const resetBoard = () => {
            board = [0,0,0,0,0,0,0,0,0];
            
            let boardCellsValues = document.querySelectorAll('.gameboard__cell-value');
            boardCellsValues.forEach( cell => {
                cell.parentElement.classList.remove('gameboard__cell_winner');
                cell.remove();
            });
        };

        return {playerMakeMove, computerMakeMove, checkWinner, resetBoard};
    })();

    
    const {resetBoard} = gameBoard;

    // create decorator for checkWinner function to call finishRound but keep original function

    const checkWinnerDecorator = (checkWinner) => {
        return function () {
            let res = checkWinner();
            if (res !== 'not finished') {
                finishRound(res);
            } else {
                return res;
            }
        }
    };

    // use checkWinner decorator

    const checkWinner = checkWinnerDecorator(gameBoard.checkWinner);

    // create decorator for computer make move function to set timeout but keep original function

    const computerMakeMoveDecorator = (computerMakeMove) => {
        return function () {
            setTimeout(() => {
                computerMakeMove();
            }, 700);
        };
    }

    // use computer make move decorator

    const computerMakeMove = computerMakeMoveDecorator(gameBoard.computerMakeMove);

    // create decorator for player make move function to unite makeMove player and computer and check winner functions but keep their originals separated

    const playerMakeMoveDecorator = (makeMove) => {
        return function (e) {
            makeMove(e);
            let res = checkWinner();
            if (getSettings().opponent === 'computer' && res === 'not finished') {
                computerMakeMove();
                setTimeout(checkWinner, 720); // computer make move has delay 700 (for human better exp, so checkWinner has delay 720)
            }
        }
    };

    // use player make move decorator

    const playerMakeMove = playerMakeMoveDecorator(gameBoard.playerMakeMove);




    const startRound = () => {
        resetBoard();

        let gameBoard = document.querySelector('.game__gameboard');
        gameBoard.classList.remove('game__gameboard_end');
        
        let wrapper = document.querySelector('.game__gameboard-wrapper');
        wrapper.classList.remove('game__gameboard-wrapper_active');

        let winnerBlock = document.querySelector('.game__winner');
        winnerBlock.classList.remove('game__winner_show');
        winnerBlock.classList.remove('game__winner_bottom');

        if (getSettings().firstMove.name === 'Computer' && getSettings().opponent === 'computer') {
            setTimeout(computerMakeMove, 700);
        }
    };

    const startGame = () => {
        let {player1, player2, bestOf} = getSettings();

        let player1Name = document.querySelector('#p1-name');
        player1Name.textContent = player1.name;
        player1Name.style.color = player1.color;

        let player1Score = document.querySelector('#p1-score');
        player1Score.textContent = player1.score;
        
        let player2Name = document.querySelector('#p2-name');
        player2Name.textContent = player2.name;
        player2Name.style.color = player2.color;

        let player2Score = document.querySelector('#p2-score');
        player2Score.textContent = player2.score;

        let bestOfElement = document.querySelector('#rounds');
        bestOfElement.textContent = bestOf;

        startRound();
    };

    const hideSymbols = (delay = 0, resolve = () => null) => {
        setTimeout(() => {
            let timerId = setTimeout(function hider () {
                boardValue = document.querySelector('.gameboard__cell-value:not(.gameboard__cell-value_hidden)');
                if (boardValue !== null) {
                    boardValue.classList.add('gameboard__cell-value_hidden');
                    boardValue.parentElement.classList.remove('gameboard__cell_winner');
                    timerId = setTimeout(hider , 200);
                } else {
                    clearTimeout(timerId);
                    resolve();
                }
            }, 200);
        }, delay);
    };

    const showRoundWinner = (cells, resolve) => {
        let timerId = setTimeout(function show () {
            let cell = document.querySelector(`.gameboard__cell[number="${cells.shift()}"]`);
            if (cell !== null) {
                cell.classList.add('gameboard__cell_winner');
                timerId = setTimeout(show, 150);
            } else {
                clearTimeout(timerId);
                resolve();
            }
        }, 150);
    };

    const finishRound = (res) => {
        if (res === 'tie') {
            new Promise(function(resolve, reject){
                hideSymbols(1000, resolve);
            }).then( () => startRound() );
            return;
        }

        let winner = getSettings().player1.symbol === res.winner ? 'player1' : 'player2';
        let {player1, player2} = getSettings();
        if (winner === 'player1') {
            player1.score++;
        } else {
            player2.score++;
        }

        let player1Score = document.querySelector('#p1-score');
        let player2Score = document.querySelector('#p2-score');
        player1Score.textContent = player1.score;
        player2Score.textContent = player2.score;

        new Promise(function(resolve, reject) {
            showRoundWinner(res.res, resolve);
        }).then( () => {
            return new Promise(function(resolve, reject){
                hideSymbols(1000, resolve);
            });
        }).then( () => {
            let winCon = Math.floor(getSettings().bestOf / 2) + 1;
            if (player1.score >= winCon || player2.score >= winCon) {
                setTimeout(finishGame, 1000);
            } else {
                startRound();
            }
        });
    };

    const finishGame = () => {
        resetBoard();
        let board = [1,2,1,2,1,2,1,2,1];
        let numOfCells = 0;

        for (let playerNum of board) {
            let cell = document.querySelector(`.gameboard__cell[number="${numOfCells}"]`);
            let player = playerNum === 1 ? getSettings().player1 : getSettings().player2;
            let symbol = document.createElement('span');
            symbol.classList.add('gameboard__cell-value', 'gameboard__cell-value_hidden');
            symbol.textContent = player.symbol;
            symbol.style.color = player.color;
            numOfCells++;
            cell.appendChild(symbol);
        }

        let timerId = setTimeout(function showSymbols() {
            let symbol = document.querySelector('.gameboard__cell-value_hidden.gameboard__cell-value');
            if (symbol !== null) {
                symbol.classList.remove('gameboard__cell-value_hidden');
                setTimeout(showSymbols, 150);
            } else {
                clearTimeout(timerId);
            }
        }, 150);

        let gameBoard = document.querySelector('.game__gameboard');
        gameBoard.classList.add('game__gameboard_end');
        
        let wrapper = document.querySelector('.game__gameboard-wrapper');
        wrapper.classList.add('game__gameboard-wrapper_active');

        let winnerBlock = document.querySelector('.game__winner');
        let {player1, player2} = getSettings();
        winnerBlock.textContent = ( player1.score > player2.score ? player1.name : player2.name ) + ' win this game!' ;
        winnerBlock.classList.add('game__winner_show');
    };

    const restartGame = () => {
        let {player1, player2} = getSettings();
        player1.score = 0;
        player2.score = 0;

        hideSymbols();

        let gameBoard = document.querySelector('.game__gameboard');
        gameBoard.classList.remove('game__gameboard_end');
        
        let wrapper = document.querySelector('.game__gameboard-wrapper');
        wrapper.classList.remove('game__gameboard-wrapper_active');

        let winnerBlock = document.querySelector('.game__winner');
        winnerBlock.classList.add('game__winner_bottom');

        setTimeout(() => {
            winnerBlock.classList.remove('game__winner_show');
            winnerBlock.classList.remove('game__winner_bottom');
        }, 1000);

        setTimeout(startGame, 2000);
    };

    // create decorator for apply settings function to unite apply settings and 
    // start game functions but not change original function from settings module  

    const applySettingsDecorator = (applySettings) => {
        return function () {
            applySettings();
            startGame();
        }
    };

    // use apply settings decorator

    const applySettings = applySettingsDecorator(settings.applySettings);
    
    return {startGame, restartGame, closeOpenSettings, resetSettings, applySettings, playerMakeMove};

})();

// event listeners for settings buttons (apply, default, close)

let btnOpenSettings = document.querySelector('.game__settings-btn');
let btnCloseSettings = document.querySelector('.settings__btn_cancel');
let btnSetDefaultSettings = document.querySelector('.settings__btn_default');
let btnApplySettings = document.querySelector('.settings__btn_apply');

btnOpenSettings.addEventListener('click', (e) =>{
    if (e.target.closest('.game__settings-btn') !== null) {
        game.closeOpenSettings();
    }
});

btnCloseSettings.addEventListener('click', game.closeOpenSettings);
btnSetDefaultSettings.addEventListener('click', game.resetSettings);
btnApplySettings.addEventListener('click', game.applySettings);

// event listener for game board with delegation for board cells

let gameBoard = document.querySelector('.game__gameboard');
gameBoard.addEventListener('click', (e) => {
    if (e.target.closest('.gameboard__cell') !== null) {
        game.playerMakeMove(e);
    }
});

// event listener for restart game button

let restartBtn = document.querySelector('.game__restart-btn');
restartBtn.addEventListener('click', game.restartGame);

// start game

game.startGame();