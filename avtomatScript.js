const sumDisp = document.querySelector('.current-sum');
const list = document.querySelector('.products-list');
const selector = document.getElementById('prod-slctr');
const toPayOutput = document.querySelector('.to-pay');
const buttonContainer = document.querySelector('.button-container');
const buttonAll = document.querySelectorAll('.button');
const rest = document.querySelector('.rest');
const banknotesData = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1]

let productsData = [];
let needToPay = 0;
let restList = 1;
let totalSum = 0;

async function loadProduct() {
    try {
        const response = await fetch('./productData.json');
        productsData = await response.json(); 
    } catch (error) {
        console.error('Error:', error);
    }
}

function buttonDisabled(button, bool) {  
    button.forEach(item => {
        item.disabled = bool;
    });
};

function disableAllButton(bool) {
    const buttons = document.querySelectorAll('.button');
    buttons.forEach(item => {
        item.disabled = bool;
    });
}

function calculateChange(change, banknotes) { 
    const result = {};
    banknotes.forEach(nominal => {
        if (change >= nominal) {
            result[nominal] = Math.floor(change / nominal);
            change %= nominal;
        }
    });
    return result;
};

function dispChange(calc) {
    const restCont = document.createElement('ul');
    restCont.classList.add('rest-list-container');
    document.body.append(restCont);
    restCont.innerHTML = ''; 
    
    Object.entries(calc).forEach(([nominal, count]) => {
        restList = document.createElement('li');
        restList.classList.add('rest-list');
        restList.innerHTML = `${count} x ${nominal} UAH`;
        restCont.append(restList);
    });
}

function clearChangeDisplay() {
    const restCont = document.querySelector('.rest-list-container');
    if (restCont) {
        restCont.remove(); 
    }
}

function uncheckAllCheckboxes() {
    const checkboxes = document.querySelectorAll('.products-list input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

function buttonClick(button, nominal) {
    button.addEventListener('click', () => {
        totalSum += nominal;
        sumDisp.textContent = `Введена сума: ${totalSum}UAH`;
        if (totalSum >= needToPay) {
            const buttons = document.querySelectorAll('.button');
            console.log('ok');
            buttonDisabled(buttons, true);
            if (totalSum === needToPay) {
                console.log('без решти');
                rest.textContent = 'Без решти';
            };
            const change = totalSum - needToPay;
            if (change > 0) {
                console.log(calculateChange(change, banknotesData));
                const calc = calculateChange(change, banknotesData);
                dispChange(calc);
                rest.textContent = `Решта: ${change}UAH`;
            };
        } else {
            console.log('need more');
            const needMore = needToPay - totalSum;
            rest.textContent = `Ще ${needMore} UAH`;
        }
    });
};

function nullF() {
    allButton = document.querySelectorAll('.button');
    buttonDisabled(allButton, false);
    sumDisp.textContent = 'Введена сума: 0 UAH';
    rest.textContent = 'Решта: '
    clearChangeDisplay();
    totalSum = 0;
}

(async () => {
    console.log('Before loading:', productsData); // Порожній масив
    await loadProduct(); // Дочекайтеся завершення завантаження
    console.log('After loading:', productsData); // Завантажені дані
    
    productsData.forEach(item => {
        const productItem = document.createElement('li');
        productItem.classList.add('product');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item.cost;
        checkbox.id = item.id;

        const label = document.createElement('label');
        label.setAttribute('for', item.id);
        label.textContent = `${item.name} ${item.cost}${item.ua}`;

        productItem.appendChild(checkbox);
        productItem.appendChild(label);
        list.appendChild(productItem);
    });
    
    list.addEventListener('change', () => {
        const checkboxes = document.querySelectorAll('.products-list input[type="checkbox"]');
        needToPay = 0;

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                needToPay += parseInt(checkbox.value);
            }
        });

        toPayOutput.textContent = `To pay: ${needToPay} UAH`;
        resetButton.disabled = false;
        clearChangeDisplay();
        nullF();

        const allUnchecked = Array.from(checkboxes).every(checkbox => !checkbox.checked);
        const buttons = document.querySelectorAll('.button');
        if (allUnchecked) {
            buttonDisabled(buttons, true); // Заблокувати всі кнопки
            resetButton.disabled = true; // Заблокувати кнопку скидання
            toPayOutput.textContent = `To pay: --`; // Оновити текст
        } else {
            buttonDisabled(buttons, false); // Розблокувати всі кнопки
        }
    });
    
    banknotesData.forEach(nominal => {
        const banknote = document.createElement('button');
        banknote.classList.add('button');
        banknote.id = `button-${nominal}`;
        banknote.innerHTML = nominal;
        banknote.disabled = true;
        buttonClick(banknote, nominal);
        buttonContainer.append(banknote);
    });
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Очистити';
    resetButton.classList.add('reset');
    resetButton.id = 'button-reset';
    resetButton.disabled = true;
    resetButton.addEventListener('click', () => {
        uncheckAllCheckboxes();
        nullF();
        disableAllButton(true);
        resetButton.disabled = true;
        toPayOutput.textContent = `To pay: --`;
    });
    buttonContainer.appendChild(resetButton);
})();

loadProduct();
console.log('hello');