// Classes
const loadJson = new LoadJSON();
const ui = new UI();
const cardPage = new CardPage();
const addToCart = new AddToCart();
const cartPage = new CartPage();

// Variables
const playerBtn = document.getElementById("video-play-btn");
const mainCarousel = [...document.querySelectorAll('.main-carousel')];

// Functions
// Load page
const loadPage = () => {
  loadJson.fetchJson()
    .then(items => {
      ui.getItems(items);
      // cardPage.displayCard(items);
      loadData();
    })
    .catch(err => {
      console.log(err);
    })
}

const loadData = () => {
  const priceValue = document.getElementById("price-value");
  const slider = document.getElementById("slider");

  const maxPrice = ui.getMaxPrice();
  const minPrice = ui.getMinPrice();


  // Change range slider 
  noUiSlider.create(slider, {

    start: [minPrice, maxPrice],
    connect: true,
    step: 0.1,
    range: {
      'min': minPrice,
      'max': maxPrice
    }
  });
  const handleBtn = [...slider.querySelectorAll(".noUi-handle")];

  slider.noUiSlider.on("update", (value) => {
    priceValue.value = `${value.join("  -  ")} $`;
    ui.changeRange(value);
  })
}

// element argument can be a selector string
// for an individual element
mainCarousel.forEach(main => {
  new Flickity(main, {
    // options
    cellAlign: 'center',
    contain: true,
    groupCells: 1
  });
})

// Call load page function when is loaded
document.addEventListener("DOMContentLoaded", loadPage);

