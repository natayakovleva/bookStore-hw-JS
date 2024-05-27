import { cartList, objectStoreName, dbName } from "./constants.js";

import { saveDataToIndexedDB } from "./dataBase.js";
import { getDataFromIndexedDB } from "./dataBase.js";
import { basketCount } from "./functions.js";

let basket = [];

// проверка - есть ли в ДБ массив
getDataFromIndexedDB("basket", function (error, data) {
  if (error) {
    console.error("Basket was empty", error);
    const report = document.querySelector(".basket__report");
    report.textContent = "Your Shopping Cart is Empty ...";
  } else {
  
    basket = data;
    if (basket.length === 0) {
      const report = document.querySelector(".basket__report");
      report.textContent = "Your Shopping Cart is Empty ...";
    }

    basketCount(basket);
    showBasketItem(basket);
    calculateTotalPrice();
    removeProduct();
  }
});

function showBasketItem(data) {
  let source = document.getElementById("basket-card-template").innerHTML;
  let template = Handlebars.compile(source);
  let html = template(data);

  cartList.innerHTML += html;
}

function calculateTotalPrice() {
  const totalEl = document.querySelector(".basket__price-total");
  const priceEl = document.querySelectorAll(".cart__price span");

  let total = 0;

  priceEl.forEach((priceElement) => {
    const priceText = priceElement.textContent;
    const price = parseFloat(priceText.replace("$", ""));
    total += price;
  });
  totalEl.textContent = total.toFixed(2);
}

// Удаление
function removeProduct() {
  const btnRemove = document.querySelectorAll(".remove-btn");

  btnRemove.forEach((button) => {
    button.addEventListener("click", (event) => {
      const cartItem = event.target.closest(".cart__product");
      if (cartItem) {
        const id = parseInt(cartItem.dataset.cartId);
        cartItem.remove();
        basket = removeDataById(basket, id);
        calculateTotalPrice();
        basketCount(basket);

        indexedDB.deleteDatabase(dbName);
        console.log('del');
        console.log(basket);
        saveDataToIndexedDB(basket, objectStoreName);

    
      }
    });
  });
}

function removeDataById(data, id) {
  return data.filter((item) => item.id !== id);
}

cartList.addEventListener("click", (event) => {
  const cartItem = event.target.closest(".cart__product");
  const countElement = cartItem.querySelector(".cart__count");
  const priceEl = cartItem.querySelector(".cart__price span");
  const message = cartItem.querySelector(".cart__message");
  const id = parseInt(cartItem.dataset.cartId);
  let count = parseInt(countElement.textContent, 10);
  const product = basket.find((item) => item.id === id);
  const stock = product.stock;
  const currentPrice = product.price;

  if (event.target.classList.contains("cart__minus")) {
    if (count > 1) {
      count--;
    }
  } else if (event.target.classList.contains("cart__plus")) {
    if (stock > count) {
      count++;
    } else {
      message.textContent = `Unfortunately there are only ${stock} items in stock`;
    }
  }

  priceEl.textContent = `${(currentPrice * count).toFixed(2)}$`;
  countElement.textContent = count;
  calculateTotalPrice();
});
