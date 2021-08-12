// Select all buttons
const buttons = Array.from(document.querySelectorAll('button'));
// Select display
const display = document.getElementById('inputDiv');
const output = document.getElementById('outputDiv');

// Add event listeners
buttons.filter(button => 'value' in button.dataset)
       .forEach(button => button.addEventListener('click', populateDisplay));    
buttons.filter(button => button.classList.contains('operator'))
       .forEach(button => button.addEventListener('click', operatorClick));
buttons.find(button => button.classList.contains('equals')).addEventListener('click', equalsCompute);
document.getElementById('clearBtn').addEventListener('click', clearDisplay);

let currentStep = 1; // Variable for keeping track of user input
let currentNumber1; 
let currentOperator;

function populateDisplay(e) {
    if (currentStep === 3) {
        display.textContent = e.target.dataset.value;
        output.textContent = '';
        currentStep = 1;
    }
    else {
        display.textContent += e.target.dataset.value;
    }
}

function operatorClick(e) {
    const operator = e.target.textContent;
    switch (currentStep) {
        case 1: // Operator has yet to be chosen
            currentNumber1 = Number(display.textContent);
            if (isNaN(display.textContent) || display.textContent === "") { // If no number was input, ignore
                return;
            }
            display.textContent += ` ${operator} `;
            currentOperator = operator;
            currentStep = 2;
            break

        case 2: // Operator has been chosen, inputting second number
            let currentInput = display.textContent.split(currentOperator);
            if (operator !== currentOperator && currentInput[currentInput.length - 1].trim() === "") {
                display.textContent = display.textContent.replace(currentOperator, operator);
                currentOperator = operator;
            }
            else {
                equalsCompute();
                display.textContent = `${output.textContent} ${operator} `;
                currentNumber1 = Number(output.textContent);
                currentOperator = operator;
                currentStep = 2;
            }
            break
        case 3: // Result has been computed, step is for chaining operations
            if (isNaN(output.textContent)) {
                output.textContent = '';
                display.textContent = '';
                currentStep = 1;
                break;
            }
            console.log('runs');
            const lastNumber = Number(output.textContent);
            display.textContent = `${lastNumber} ${operator} `;
            currentNumber1 = lastNumber;
            currentOperator = operator;
            output.textContent = '';
            currentStep = 2;
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
}