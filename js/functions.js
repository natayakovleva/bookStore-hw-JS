export function basketCount(data) {
  const basketCount = document.querySelector(".basket__count");
  basketCount.textContent = data.length;
}

function findBtnById(id) {
  const cards = document.querySelector("#product-list");
  const card = cards.querySelector(`.card[data-product-id="${id}"]`);
  if (card) {
    const btn = card.querySelector(".card__add");
    return btn;
  } else {
    return null;
  }
}

export function activeCards(data) {
  const ids = data.map((item) => item.id);
  ids.forEach((productId) => {
    const btn = findBtnById(productId);
    if (btn) {
      btn.classList.add("active");
    }
  });
}

export function sliceData(data, points) {
  return data.slice(points.skip, points.limit);
}

export function htmlTemplate(nameId, data, wrap) {
  let source = document.getElementById(nameId).innerHTML;
  let template = Handlebars.compile(source);
  let html = template(data);
  wrap.innerHTML += html;
}
