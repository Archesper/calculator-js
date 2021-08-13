// Select all buttons
const buttons = Array.from(document.querySelectorAll('button'));
// Select display
const display = document.getElementById('inputDiv');
const output = document.getElementById('outputDiv');

// Initialize keyboardSupportMap
// Keys are event code arrays, values are functions that should be run when corresponding keys are clicked
const keyboardSupportMap = new Map();
keyboardSupportMap.set(['Digit0', 'Digit1', 'Digit2', 'Digit3', 'Digit4',
'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Numpad0', 'Numpad1',
'Numpad2', 'Numpad3', 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8',
'Numpad9', 'NumpadDecimal', 'Comma'], populateDisplay);
keyboardSupportMap.set(['NumpadAdd', 'NumpadSubtract', 'NumpadMultiply', 'NumpadDivide']
, operatorClick)
keyboardSupportMap.set(['Enter', 'Equal'], equalsCompute);
keyboardSupportMap.set(['Backspace', 'Escape'], backspace);



// Add event listeners
buttons.filter(button => 'value' in button.dataset)
       .forEach(button => button.addEventListener('click', populateDisplay));    
buttons.filter(button => button.classList.contains('operator'))
       .forEach(button => button.addEventListener('click', operatorClick));
buttons.find(button => button.classList.contains('equals')).addEventListener('click', equalsCompute);
document.getElementById('clearBtn').addEventListener('click', clearDisplay);
document.getElementById('deleteBtn').addEventListener('click', backspace);
// Event listener for keyboard support
window.addEventListener('keydown', keyToFunctionCall);


let currentStep = 1; // Variable for keeping track of user input
let currentNumber1; 
let currentOperator;
let alreadyDecimal = false; // variable for keeping track if user has already input a decimal dot in current phase



function populateDisplay(e) {
    let value;
    if (!(e instanceof Event)) { // Keyboard support
        if (e === 'NumpadDecimal' || e === 'Comma') {
            value = '.';
        }
        else {
            value = e[e.length - 1];
        }
    }
    else {
        value = e.target.dataset.value;
    }
    if (currentStep === 3 && value !== '.') { // If a result was just output, clear output screen 
        display.textContent = value;
        output.textContent = '';
        currentStep = 1;
        toggleAlreadyDecimal(false);
    }
    else {
        // If user is inputting a decimal point:
        if (value === '.') {
            // In step 1, add decimal point if there is already a number in the display and a decimal point has yet to be input
            if (currentStep === 1
                && display.textContent.trim() !== ''
                && alreadyDecimal === false) {
                    console.log('this');
                    display.textContent += value;
                    toggleAlreadyDecimal(true);
                }
            else if (currentStep === 2
                && alreadyDecimal === false) {
                    let currentInput = display.textContent.split(currentOperator);
                    if (currentInput[currentInput.length - 1].trim() !== '') {
                        display.textContent += value;
                        toggleAlreadyDecimal(true);
                    }
                }
        }
        else if (value !== '.') {
            display.textContent += value;
        }
    }
}

function operatorClick(e) {
    let operator;
    if (!(e instanceof Event)) { // Keyboard support
        switch (e) {
            case 'NumpadAdd':
                operator = '+';
                break;
            case 'NumpadSubtract':
                operator = '-';
                break;
            case 'NumpadMultiply':
                operator = 'x';
                break;
            case 'NumpadDivide':
                operator = '÷';
        }
    }
    else {
        operator = e.target.textContent;
    }
    switch (currentStep) {
        case 1: // Operator has yet to be chosen
            currentNumber1 = Number(display.textContent);
            if (isNaN(display.textContent) || display.textContent === "") { // If no number was input, ignore
                return;
            }
            display.textContent += ` ${operator} `;
            currentOperator = operator;
            currentStep = 2;
            toggleAlreadyDecimal(false);
            break

        case 2: // Operator has been chosen, inputting second number
            let currentInput = display.textContent.split(currentOperator);
            if (operator !== currentOperator && currentInput[currentInput.length - 1].trim() === "") {
                display.textContent = display.textContent.replace(currentOperator, operator);
                currentOperator = operator;
            }
            else {
                equalsCompute();
                if (output.textContent === 'ZERO DIVISION ERROR') {break;}
                display.textContent = `${output.textContent} ${operator} `;
                currentNumber1 = Number(output.textContent);
                currentOperator = operator;
                currentStep = 2;
                toggleAlreadyDecimal(false);
            }
            break
        case 3: // Result has been computed, step is for chaining operations
            // If last reached result was a ZERO DIVISION ERROR, clear the calculator
            if (output.textContent === 'ZERO DIVISION ERROR') {
                clearDisplay();
                break;
            }
            const lastNumber = Number(output.textContent);
            display.textContent = `${lastNumber} ${operator} `;
            currentNumber1 = lastNumber;
            currentOperator = operator;
            output.textContent = '';
            currentStep = 2;
            toggleAlreadyDecimal(false);
    }
}

function operate(n1, n2, operator) {
    switch (operator) {
        case '+':
            return n1 + n2;
        case '÷':
            if (n2 === 0) {
                return 'ZERO DIVISION ERROR';
            }
            else if (n1 % n2 === 0) {
                return n1/n2;
            }
            else {
                return Math.round((n1/n2)*10000000000)/10000000000;
            }
        case 'x':
            if (String(n1).includes('.') || String(n2).includes('.')) {
                return Math.round((n1*n2)*10000000000)/10000000000;
            }
            return n1*n2;
        case '-':
            return n1 - n2;
    }
}

function equalsCompute() {
    if (output.textContent === 'ZERO DIVISION ERROR') {
        clearDisplay();
    }
    let currentInput = display.textContent.split(currentOperator);
    console.log(currentInput);
    let currentNumber2 = Number(currentInput[currentInput.length - 1]);
    if (currentStep != 2 || isNaN(currentNumber2) ||
     currentInput[currentInput.length - 1].trim() === "") { // ignores equal click before having a full expression to compute
        return;
    }
    console.log(currentNumber1);
    console.log(currentNumber2);
    console.log(currentOperator);
    const result = operate(currentNumber1, currentNumber2, currentOperator);
    output.textContent = result;
    currentStep = 3;
}

function clearDisplay() {
    display.textContent = '';
    output.textContent = '';
    currentStep = 1;
    currentNumber1 = undefined;
    currentOperator = undefined;
    toggleAlreadyDecimal(false);
}

function backspace() {
    switch (currentStep) {
        case 1:
            if (display.textContent[display.textContent.length - 1] === '.') {
                toggleAlreadyDecimal(false);
            }
            display.textContent = display.textContent.slice(0, -1);
            break;
        case 2:
            let currentInput = display.textContent.split(currentOperator);
            if (currentInput[currentInput.length - 1].trim() === '') { // If second number has yet to be input
                display.textContent = display.textContent.slice(0, -3); // Starting from -3 to account for the whitespaces the operateClick() function introduces
                currentOperator = undefined;
                currentStep = 1;
            }
            else {
                if (display.textContent[display.textContent.length - 1] === '.') {
                    toggleAlreadyDecimal(false);
                }
                display.textContent = display.textContent.slice(0, -1);
            }
            break;
        case 3:
            output.textContent = '';
            currentStep = 2;
    }
}

function toggleAlreadyDecimal(bool) {
    const decimalButton = document.querySelector('.decimal');
    if (bool) {
        alreadyDecimal = true;
        decimalButton.classList.add('inactive');
    }
    else {
        alreadyDecimal = false;
        decimalButton.classList.remove('inactive');
    }
}

function keyToFunctionCall(e) {
    const code = e.code;
    keys = keyboardSupportMap.keys();
    for (const key of keys) {
        if (key.includes(code)) {
            const functionTocall = keyboardSupportMap.get(key);
            functionTocall(code);
        }
    }
}

