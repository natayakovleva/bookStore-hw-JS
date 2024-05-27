
export const cards = document.querySelector("#product-list");
export const loadMoreBtn = document.querySelector("#loadMore");
export const applyFiltersBtn = document.querySelector('.apply');
export const ascBtn = document.querySelector('.sort__price-asc');
export const descBtn = document.querySelector('.sort__price-desc');

export const cartList = document.querySelector("#basket-list");

export  const pagination = {
  skip: 0,
  limit: 5,
  count: 5,

  nextStart() {
    this.skip += this.count;
  },

  nextFinish() {
    this.limit = this.count + this.skip;
  },
};

export const objectStoreName = 'basket';
export const dbName = 'universal-store'; 