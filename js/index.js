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
