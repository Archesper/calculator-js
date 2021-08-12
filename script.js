// Select all buttons
const buttons = Array.from(document.querySelectorAll('button'));
// Select display
const display = document.getElementById('display');

buttons.filter(button => 'value' in button.dataset)
       .forEach(button => button.addEventListener('click', populateDisplay));    

function populateDisplay(e) {
    display.textContent += e.target.dataset.value;
}
 