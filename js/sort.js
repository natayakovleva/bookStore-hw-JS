export function sortProductsPriceAsc(data) {
  return data.slice().sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
}


export function sortProductsPriceDesc(data) {
  return data.slice().sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
}