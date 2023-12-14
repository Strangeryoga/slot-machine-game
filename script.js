
// to getting input from the user
const prompt = require('prompt-sync')();

// Constants for the number of rows and columns in the slot machine
const ROWS = 3;
const COLS = 3;

// Symbols present in a reel and their counts
const SYMBOLS_COUNT = {
    'A': 2,
    'B': 4,
    'C': 6,
    'D': 8
}

// multiplier/value for each symbol
// If 'A' comes, it will be multiplied by 5 with the bet
const SYMBOLS_VALUES = {
    'A': 5,
    'B': 4,
    'C': 3,
    'D': 2
}

// Function to get user deposit
const deposit = () => {
    // checking if the user typed correct input or not
    while(true){
        const depositAmount = prompt("Enter a deposite amount: ");
        const noDepositAmount = parseFloat(depositAmount);  // converting string given by prompt into float no.
        if(isNaN(noDepositAmount) || noDepositAmount <=0) {
            console.log("Invalid deposit amount..");
        }else{
            return noDepositAmount;
        }
    }
};

// Function to get the number of lines to bet on
const getNumberOfLines = () => {
     // checking if the user typed correct input or not
     while(true){
        const lines = prompt("Enter the no of line to bet on (1-3): ");
        const noOfLines = parseFloat(lines);  // converting string given by prompt into float no.
        if(isNaN(noOfLines) || noOfLines <=0 || noOfLines>3) {
            console.log("Invalid no of lines..");
        }else{
            return noOfLines;
        }
    }
}

// Function to get the bet per line
const getBet = (balance, lines) => {
    // checking if the user typed correct input or not
    while(true){
        const bet = prompt("Enter the bet per line: ");
        const noBet = parseFloat(bet);  // converting string given by prompt into float no.
        if(isNaN(noBet) || noBet <= 0 || noBet > balance / lines) {
            console.log("Invalid bet ..");
        }else{
            return noBet;
        }
    }
}

// Function to randomly select symbols for each reel
const spin = () => {
    const symbols = [];
    for(const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for(let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }
    // console.log(symbols);
    // this represents col in slot machine
    // [[A A A] [A B A] [C D A]]
    const reels = []
    for (let i = 0; i < COLS; i++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);

        }
    }
    return reels;
  
}

// Function to transpose the array
// [A B A] [C D A] [B B A] into [A C B] [B D B] [A A A]
// checking the rows in the reels
const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    
    return rows;
}

// Function to print the rows in a specific manner
const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()){
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString);
    }
}

// Function to check if the user won in a specific row
const getWinnings = (rows ,bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        // Check if all symbols in the row are the same
        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        // If all symbols are the same, multiply bet by SYMBOLS_VALUES
        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }

    return winnings;
}

// Main game function
const game = () => {
    let balance= deposit();

    while (true) {
        console.log(`You have a balance of $ ${balance}`);
        const lines = getNumberOfLines();
        const bet = getBet(balance, lines);
        // Subtract bet * lines from the balance
        balance -= bet * lines;
        const reels =spin();
        const rows = transpose(reels)
        printRows(rows);
        const winnings = getWinnings(rows, bet, lines)
        // Add winnings to the balance 
        balance += winnings;
        console.log(`You won $ ${winnings.toString()}`);

        // Check if the balance is zero or negative
        if (balance <= 0) {
            console.log("You ran out of money...");
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n)?")
        if (playAgain != 'y') break;
    }
}

// Run the game
game()

