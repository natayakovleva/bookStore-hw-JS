import { cards, loadMoreBtn, applyFiltersBtn, pagination, ascBtn, descBtn, objectStoreName } from './constants.js';


import { saveDataToIndexedDB } from './dataBase.js';
import { getDataFromIndexedDB } from "./dataBase.js";
import { basketCount } from './functions.js';
import { activeCards } from './functions.js';
import { sliceData } from './functions.js';
import { getFilters } from './filter.js';
import { setFilters } from './filter.js';
import { selectFilter } from './filter.js';
import { sortProductsPriceAsc } from './sort.js';
import { sortProductsPriceDesc } from './sort.js';


let productsData = [];
let displayData = [];
let basket = [];

getData();

// проверка - есть ли в ДБ массив
getDataFromIndexedDB(objectStoreName, function (error, data) {
  if (error) {
    console.error("Basket was empty", error);
  } else {
    basket = data;
    basketCount(basket);
    activeCards(basket); 
  }
});

async function getData() {
  try {
    if (!productsData.length) {
      // если массив не пустой
      const res = await fetch(`../data/products.json`);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      productsData = await res.json();
      displayData = JSON.parse(JSON.stringify(productsData));

      showData(displayData);

    }
  } catch (err) {
    console.log(err.message);
  }
}


function showData(data) {

//   Крок 3: Отримання шаблону
  let source = document.getElementById("product-card-template").innerHTML;
  let template = Handlebars.compile(source);

  const showData = sliceData(data, pagination);

  pagination.nextStart();
  pagination.nextFinish();

  // Крок 4: Генерація HTML за допомогою шаблону та даних
  let html = template(showData);
  // Крок 5: Вставка згенерованого HTML в DOM
  cards.innerHTML += html;
}

loadMoreBtn.onclick = () => {

  showData(displayData);
  activeCards(basket); 

  if (pagination.skip >= displayData.length) {

    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'End';
    loadMoreBtn.style.backgroundColor = '#2aa9bd';
  }

};

cards.addEventListener('click', handleCardClick);

function handleCardClick(event) {
    const targetButton = event.target.closest('.card__add');
    if (!targetButton) return;
    const card = targetButton.closest('.card');
    const id = parseInt(card.dataset.productId);
    const currentProduct = productsData.find(item => item.id === id);
    targetButton.classList.toggle('active');
    if (basket.includes(currentProduct)) return;
    basket.push(currentProduct);
    basketCount(basket);
    saveDataToIndexedDB(basket, objectStoreName);
  }


applyFiltersBtn.addEventListener('click', () => {

  if (pagination.skip > displayData.length) {

    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = 'Add to Cart';
    loadMoreBtn.style.backgroundColor = '#e2ebed';
  }

    const categoryGroup = document.querySelectorAll('#categoryGroup input[type="checkbox"]');
    const languageGroup = document.querySelectorAll('#languageGroup input[type="checkbox"]');
    const bindingGroup = document.querySelectorAll('#bindingGroup input[type="checkbox"]');
    const allGroups = [...categoryGroup, ...languageGroup, ...bindingGroup];
    const allUnchecked = allGroups.every(checkbox => !checkbox.checked);
    
    if (allUnchecked) {
      displayData = JSON.parse(JSON.stringify(productsData));
      startParameters();
      showData(displayData);
      activeCards(basket);
      return;
    } 
  
    const filtersList = getFilters(); 
    const filteredData = setFilters(productsData, filtersList);
    
    startParameters();
    displayData = JSON.parse(JSON.stringify(filteredData));
  
    showData(displayData);
    activeCards(basket);
  });

  function startParameters() {
    pagination.skip = 0;
    pagination.limit = 5;
    cards.innerHTML = '';
  }

selectFilter('categoryGroup');
selectFilter('languageGroup');
selectFilter('bindingGroup');

// Сортировка


ascBtn.addEventListener('click', () => {
  const sortData = sortProductsPriceAsc(displayData);
  displayData = JSON.parse(JSON.stringify(sortData));
  startParameters();
  showData(displayData);
  // activeCards(basket);
  // const sortSkip = 0;
  // const sortTake = countOfCardsOnScrean;

  // getProducts(basket, displayData, sortSkip, sortTake);

});

descBtn.addEventListener('click', () => {
  const sortData = sortProductsPriceDesc(displayData);
  displayData = JSON.parse(JSON.stringify(sortData));
  startParameters();
  showData(displayData);
  // activeCards(basket);
  // const sortSkip = 0;
  // const sortTake = countOfCardsOnScrean;

  // getProducts(basket, displayData, sortSkip, sortTake);

});