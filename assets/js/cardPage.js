class CardPage {

    constructor() {
        this.productCardHolder = document.getElementById("product-card-holder");
        this.imagesArray = [];
    }

    getToCard(items, e) {
        this.displayCard(items, e);
        this.getThumbnailsImg(items, e);
        this.addThumbnails(items, e);
        this.changeColor(e);
        this.checkAmount(items, e);
    }

    displayCard(items, e) {
        const id = e.target.dataset.id
        items.map((item, index) => {
            const productName = this.productCardHolder.querySelector(".product-name-card");
            const productDesc = this.productCardHolder.querySelector(".description");
            const productImg = this.productCardHolder.querySelector(".product-card-img");
            const addBtn = this.productCardHolder.querySelector(".add-cart-btn");
            const cartBtn = this.productCardHolder.querySelector(".show-cart-btn");
            
            if (id == item.id) {
                productName.textContent = item.name;
                productDesc.textContent = item.desc;
                productImg.src = item.image;
                addBtn.dataset.id = item.id;
                
                // cartBtn.addEventListener("click", this.getCartPage.bind(this));
                addBtn.addEventListener("click", this.addToCartBtn.bind(this, item));
            }
        })
    }

    getCartPage(e){
        cartPage.getCart(e)
    }

    getThumbnailsImg(items, e) {
        const id = e.target.dataset.id;
        const existImgId = this.imagesArray.findIndex(img => img.id == id);
        items.forEach(item => {
            if (id == item.id) {
                for (let key in item.imagesColor) {
                    if (existImgId < 0) {
                        this.imagesArray.push({
                            id: item.id,
                            src: item.imagesColor[key],
                            color: key
                        });
                    }
                }
            }
        })
    }


    getcolorItems(cardItem, color) {
        const colorsHoldor = [...cardItem.querySelectorAll(".color-holdor")];
        const option = document.createElement("option");
        const colorSpot = document.createElement("span");
        const colorName = document.createElement("span");

        colorSpot.classList.add("color-spot");
        colorName.classList.add("color-name");

        option.appendChild(colorSpot);
        option.appendChild(colorName);


        colorsHoldor.forEach(elem => {
            if (elem.dataset.id == color.id) {
                option.value = color.color;
                colorName.textContent = color.color;
                elem.appendChild(option)
            }
        })
    }

    addThumbnails(items, e) {
        const id = e.target.dataset.id;
        const thumbnailHolder = this.productCardHolder.querySelector(".thumbnail-img");

        while (thumbnailHolder.firstChild) {
            thumbnailHolder.firstChild.remove();
        }
        this.imagesArray.forEach(img => {
            if (id == img.id) {
                const imgContainer = document.createElement("div");
                const thumbnailImg = document.createElement("img");
                imgContainer.classList.add("img-container", "carousel-sell")
                ui.setAttributes(thumbnailImg, {
                    "src": img.src,
                    "data-id": img.id,
                    "alt": "thumbnail product"
                })
                imgContainer.appendChild(thumbnailImg);
                thumbnailHolder.appendChild(imgContainer);
            }
        })
    }

    changeColor(e) {
        const colorSelect = this.productCardHolder.querySelector(".color");
        const id = e.target.dataset.id;

        while (colorSelect.firstChild) {
            colorSelect.firstChild.remove();
        }

        this.imagesArray.forEach(color => {

            if (id == color.id) {
                const colorOption = document.createElement("option");
                const colorSpot = document.createElement("span");
                const colorName = document.createElement("span");
                colorOption.value = color.color;

                ui.setAttributes(colorSpot, {
                    "class": "color-spot",
                    "style": `background-color: ${color.color}`
                })
                colorName.classList.add("color-name");

                colorName.textContent = color.color;

                colorOption.appendChild(colorSpot);
                colorOption.appendChild(colorName);
                colorSelect.appendChild(colorOption);
            }
        })
    }

    checkAmount(items, e) {
        let selectAmount = this.productCardHolder.querySelector("select.amount");
        let inputAmount = this.productCardHolder.querySelector("input.amount");
        const id = e.target.dataset.id;

        inputAmount.classList.add("d-none");
        selectAmount.classList.remove("d-none");
        selectAmount.value = 1;
        inputAmount.value = "";

        selectAmount.addEventListener("change", () => {
            if (selectAmount.value === "more-amount") {
                inputAmount.classList.remove("d-none");
                selectAmount.classList.add("d-none");
                inputAmount.focus();

            }
        })

        inputAmount.addEventListener("blur", () => {
            items.forEach(item => {
                if (id == item.id) {
                    if (inputAmount.value === "") {
                        inputAmount.classList.add("d-none");
                        selectAmount.classList.remove("d-none");
                        selectAmount.value = 1;
                    } else if (inputAmount.value > item.inStock) {
                        inputAmount.value = item.inStock;
                    } else if (inputAmount.value <= 0 || isNaN(inputAmount.value)) {
                        inputAmount.value = 1;
                    }
                }
            })
        })
    }

    addToCartBtn(item, e) {
        const id = e.target.dataset.id;
        if (id == item.id) {
            addToCart.getProduct(item);
        }
    }
}