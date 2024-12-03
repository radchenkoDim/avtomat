let productsData = [];

const sumDisp = document.querySelector('.current-sum');
const list = document.querySelector('.products-list');
const selector = document.getElementById('prod-slctr');
const toPayOutput = document.querySelector('.to-pay');

async function loadProduct() {
    try {
        const response = await fetch('./productData.json');
        productsData = await response.json(); 
    } catch (error) {
        console.error('Error:', error);
    }
}

(async () => {
    console.log('Before loading:', productsData); // Порожній масив
    await loadProduct(); // Дочекайтеся завершення завантаження
    console.log('After loading:', productsData); // Завантажені дані
    const banknotesData = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1]
    let totalSum = 0;
    
    const button = document.querySelector('.button-container');
    let allButton = 0;
    
    productsData.forEach(item => {
        const products = document.createElement('li');
        products.classList.add('product');
        products.innerHTML = item.name + ' ' + item.cost + item.ua;
        list.append(products); 
    });
    
    productsData.forEach(item => {
        const option = document.createElement('option');
        option.classList.add('option'); 
        option.value = item.id;
        option.innerHTML = item.name.trim();
        selector.append(option);
    });
    
    // let x = 0;
    selector.addEventListener('change', (event) => {
        // if (!x) {
        //     document.querySelector('.option').remove();
        //     x++;
        // }
        let selectedId = event.target.value;
        let product = null;
        nullF();
        if (selectedId === "p-000") {
            toPayOutput.textContent = 'To pay: --';
            nullF();
            buttonDisabled(allButton, true);
            resetButton.disabled = true;
        } else if (selectedId) {
            product = productsData.find(item => item.id === selectedId);
            needToPay = product.cost;
            console.log(needToPay);
            if (product) {
                toPayOutput.textContent = `To pay: ${product.cost + product.ua}`;
            }
        }
    });
    
    function buttonDisabled(button, bool) {  
        button.forEach(item => {
            item.disabled = bool;
        });
    };
    
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
    
    let restList = 1;
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
    
    let needToPay = 0;
    
    function buttonClick(button, nominal) {
        button.addEventListener('click', () => {
            allButton = document.querySelectorAll('.button');
            totalSum += nominal;
            sumDisp.textContent = `Введена сума: ${totalSum}UAH`;
            if (totalSum >= needToPay) {
                console.log('ok');
                buttonDisabled(allButton, true);
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
        resetButton.disabled = false;
        sumDisp.textContent = 'Введена сума: 0 UAH';
        rest.textContent = 'Решта: '
        clearChangeDisplay();
        totalSum = 0;
    }
    
    const rest = document.querySelector('.rest');
    
    banknotesData.forEach(nominal => {
        const banknote = document.createElement('button');
        banknote.classList.add('button');
        banknote.id = `button-${nominal}`;
        banknote.innerHTML = nominal;
        banknote.disabled = true;
        buttonClick(banknote, nominal);
        button.append(banknote);
    });
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Очистити';
    resetButton.classList.add('reset');
    resetButton.disabled = true;
    resetButton.addEventListener('click', () => nullF());
    button.appendChild(resetButton);
})();

loadProduct();
console.log('hello');