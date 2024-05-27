import { objectStoreName } from "./constants.js";
import { basketCount } from "./functions.js";
import { getDataFromIndexedDB } from "./dataBase.js";
let basket = [];

getDataFromIndexedDB(objectStoreName, function (error, data) {
  if (error) {
    console.error("Basket was empty", error);
  } else {
    basket = data;
    basketCount(basket);
  }
});


// function init() {
//   import('./catalog.js');
//   import('./catalog.js');
//   import('./constants.js');
//   import('./dataBase.js');
//   import('./functions.js');
//   import('./filter.js');
//   import('./sort.js');
// }

// const totalPartials = document.querySelectorAll('[hx-trigger="load"], [data-hx-trigger="load"]').length;
// let loadedPartialsCount = 0;

// document.body.addEventListener('htmx:afterOnLoad', () => {
//   loadedPartialsCount++;
//   if (loadedPartialsCount === totalPartials) init();
// });
