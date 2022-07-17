const game = (() => {

    // game board module

    const gameBoard = (() => {

    })();

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
                name: 'player1',
                symbol: 'x',
                color: '#ea1a4b',
            };
            player2 = {
                name: 'player2',
                symbol: 'o',
                color: '#fbd12f',
            };
            firstMove = player1.name;

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
                    debugger;
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

        })();

        const Player = (name, symbol, color) => {
            return {name, symbol, color};
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

            let player1Name = document.querySelector('#input-p1-name').value || 'player1';
            let player1Symbol = document.querySelector('.input_symbol[name="p1-symbol"]:checked').value;
            let player1Color = document.querySelector('#input-p1-color').value;

            player1 = Player(player1Name, player1Symbol, player1Color);
            
            let player2Name = (opponent === 'player' ? document.querySelector('#input-p2-name').value : 'computer') || 'player2';
            let player2Symbol = document.querySelector('.input_symbol[name="p2-symbol"]:checked').value;
            let player2Color = document.querySelector('#input-p2-color').value;
            
            player2 = Player(player2Name, player2Symbol, player2Color);
            
            firstMove = [player1, player2].find(player => player.symbol === 'x').name;

            closeOpenSettings();
        };

        const getSettings = () => {
            return {opponent, bestOf, player1, player2, firstMove};
        };

        return {closeOpenSettings, resetSettings, applySettings, getSettings};
    })();


    const {closeOpenSettings, resetSettings, applySettings, getSettings} = settings;
        
    const startGame = () => {};
    const restartGame = () => {};
    const makeMove = () => {};
    
    return {startGame, restartGame, closeOpenSettings, resetSettings, applySettings, makeMove, getSettings};

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