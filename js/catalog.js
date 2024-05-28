import {
  cards,
  loadMoreBtn,
  applyFiltersBtn,
  pagination,
  ascBtn,
  descBtn,
  objectStoreName,
  btnSearch
} from "./constants.js";

import {
  basketCount,
  activeCards,
  sliceData,
  htmlTemplate
} from "./functions.js";

import { getFilters, setFilters, selectFilter } from "./filter.js";
import { sortProductsPriceAsc, sortProductsPriceDesc } from "./sort.js";
import { saveDataToIndexedDB, getDataFromIndexedDB } from "./dataBase.js";

let productsData = [];
let displayData = [];
let basket = [];

getData();

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

      productsData = await (await fetch(`data/products.json`)).json();
      displayData = JSON.parse(JSON.stringify(productsData));
      showData(displayData);
    }
  } catch (err) {
    console.log(err.message);
  }
}

function showData(data) {
  const showData = sliceData(data, pagination);
  pagination.nextStart();
  pagination.nextFinish();
  htmlTemplate("product-card-template", showData, cards);
}

loadMoreBtn.onclick = () => {
  showData(displayData);
  activeCards(basket);
  loadMoreBtnEnd(displayData);
};

function loadMoreBtnEnd(data) {
  if (pagination.skip >= data.length) {
    loadMoreBtn.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'block';
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = "Show More";
    loadMoreBtn.style.backgroundColor = '#e2ebed';
  }
}

cards.addEventListener("click", handleCardClick);

function handleCardClick(event) {
  const targetButton = event.target.closest(".card__add");
  if (!targetButton) return;
  const card = targetButton.closest(".card");
  const id = parseInt(card.dataset.productId);
  const currentProduct = productsData.find((item) => item.id === id);
  targetButton.classList.add("active");
  if (basket.includes(currentProduct)) return;
  basket.push(currentProduct);
  basketCount(basket);
  saveDataToIndexedDB(basket, objectStoreName);
}

applyFiltersBtn.addEventListener("click", () => {
  const categoryGroup = document.querySelectorAll(
    '#categoryGroup input[type="checkbox"]'
  );
  const languageGroup = document.querySelectorAll(
    '#languageGroup input[type="checkbox"]'
  );
  const bindingGroup = document.querySelectorAll(
    '#bindingGroup input[type="checkbox"]'
  );
  const allGroups = [...categoryGroup, ...languageGroup, ...bindingGroup];
  const allUnchecked = allGroups.every((checkbox) => !checkbox.checked);

  if (allUnchecked) {
    displayData = JSON.parse(JSON.stringify(productsData));
    startParameters();
    showData(displayData);
    activeCards(basket);
    loadMoreBtnEnd(displayData);
    return;
  }
  const filtersList = getFilters();
  const filteredData = setFilters(productsData, filtersList);
  startParameters();
  displayData = JSON.parse(JSON.stringify(filteredData));
  showData(displayData);
  activeCards(basket);
  loadMoreBtnEnd(displayData);
});

function startParameters() {
  pagination.skip = 0;
  pagination.limit = 5;
  cards.innerHTML = "";
}

selectFilter("categoryGroup");
selectFilter("languageGroup");
selectFilter("bindingGroup");

ascBtn.addEventListener("click", () => {
  const sortData = sortProductsPriceAsc(displayData);
  displayData = JSON.parse(JSON.stringify(sortData));
  startParameters();
  showData(displayData);
  loadMoreBtnEnd(displayData);
});

descBtn.addEventListener("click", () => {
  const sortData = sortProductsPriceDesc(displayData);
  displayData = JSON.parse(JSON.stringify(sortData));
  startParameters();
  showData(displayData);
  loadMoreBtnEnd(displayData);
});


btnSearch.addEventListener("click", searchData);

function searchData() {
  const input = document.getElementById("searchInput");
  const filter = input.value.toUpperCase();
  const results = productsData.filter((item) => {
    return (
      item.author.toLowerCase().includes(filter.toLowerCase()) ||
      item.title.toLowerCase().includes(filter.toLowerCase())
    );
  });
  startParameters();
  showData(results);
  loadMoreBtnEnd(results);
}
