class CartPage {
    constructor() {
        this.showCart = document.getElementById("show-cart");


        // ELEMENTS CREATE
        this.cartItem;
        this.itemDetails;
        this.imgContainer;
        this.cartImg;
        this.detaileS;
        this.cartName;
        this.cartDesc;
        this.starsHolder;
        this.priceHolder;
        this.priceSymbol;
        this.price;
        this.cartAmount;
        this.countMinus;
        this.countPlus;
        this.amountInput;
        this.minusIcon;
        this.plusIcon;
        this.totalPriceHolder;
        this.totalSymbol;
        this.totalPrice;
        this.removeItemHolder;
        this.removeBtn;
        this.removeIcon;
    }

    getCart() {
        this.displayCart();
    }

    displayCart() {
        const products = [...addToCart.getFromStorage()];
        const cartItems = this.showCart.querySelector(".cart-items");

        while (cartItems.firstChild) {
            cartItems.firstChild.remove()
        }
        cartItems.textContent = "";

        products.map(product => {
            this.cartItem = document.createElement("li");
            this.itemDetails = document.createElement("div");
            this.imgContainer = document.createElement("div");
            this.cartImg = document.createElement("img");
            this.detaileS = document.createElement("div");
            this.cartName = document.createElement("h3");
            this.cartDesc = document.createElement("p");
            this.starsHolder = document.createElement("ul");
            this.priceHolder = document.createElement("p");
            this.priceSymbol = document.createElement("span");
            this.price = document.createElement("span");
            this.cartAmount = document.createElement("div");
            this.countMinus = document.createElement("span");
            this.countPlus = document.createElement("span");
            this.amountInput = document.createElement("input");
            this.totalPriceHolder = document.createElement("p");
            this.totalSymbol = document.createElement("span");
            this.totalPrice = document.createElement("span");
            this.removeItemHolder = document.createElement("div");
            this.removeBtn = document.createElement("span");

            // ADD CLASS LIOST TO ELEMENTS
            this.cartItem.classList.add("cart-item");
            this.itemDetails.classList.add("item-details");
            this.imgContainer.classList.add("img-container");
            this.detaileS.classList.add("details");
            this.cartName.classList.add("title", "cart-name");
            this.cartDesc.classList.add("description");
            this.priceHolder.classList.add("text", "price");
            this.priceSymbol.classList.add("symbol");
            this.price.classList.add("cart-price");
            this.cartAmount.classList.add("cart-amount");
            this.countMinus.classList.add("text", "counter", "count-minus");
            this.countPlus.classList.add("text", "counter", "count-plus");
            this.amountInput.classList.add("text", "amount");
            this.totalPriceHolder.classList.add("text", "total-price");
            this.totalSymbol.classList.add("symbol");
            this.totalPrice.classList.add("cart-total-price");
            this.removeItemHolder.classList.add("remove-btn");
            this.removeBtn.classList.add("text", "delete");
            // this.removeIcon.classList.add("fas", "fa-times");

            // SET ATTRIBUTE TO ELEMENTS
            ui.setAttributes(this.cartImg, {
                "src": product.image,
                "class": "img-fluid",
                "alt": product.name
            });

            this.cartName.textContent = `${product.name} - ${product.color}`;
            this.cartDesc.textContent = product.desc;

            this.priceSymbol.textContent = "$";
            this.price.textContent = product.price.toFixed(2);

            this.amountInput.value = product.qty;

            this.countMinus.innerHTML = "&#45;";
            this.countPlus.innerHTML = "&#43;";

            this.amountInput.dataset.countid = product.id;
            this.countMinus.dataset.countid = product.id;
            this.countPlus.dataset.countid = product.id;


            this.totalSymbol.textContent = "$";
            this.totalPrice.textContent = this.multiple(product.price, product.qty);
            this.removeBtn.textContent = "X";

            this.removeBtn.setAttribute("data-id", product.id);

            this.cartItem.appendChild(this.itemDetails);
            this.cartItem.appendChild(this.priceHolder);
            this.cartItem.appendChild(this.cartAmount);
            this.cartItem.appendChild(this.totalPriceHolder);
            this.cartItem.appendChild(this.removeItemHolder);

            this.itemDetails.appendChild(this.imgContainer);
            this.itemDetails.appendChild(this.detaileS);

            this.imgContainer.appendChild(this.cartImg);

            this.detaileS.appendChild(this.cartName);
            this.detaileS.appendChild(this.cartDesc);
            this.detaileS.appendChild(this.starsHolder);


            this.priceHolder.appendChild(this.priceSymbol);
            this.priceHolder.appendChild(this.price);

            this.cartAmount.appendChild(this.countMinus);
            this.cartAmount.appendChild(this.amountInput);
            this.cartAmount.appendChild(this.countPlus);

            this.totalPriceHolder.appendChild(this.totalSymbol);
            this.totalPriceHolder.appendChild(this.totalPrice);

            this.removeItemHolder.appendChild(this.removeBtn);

            cartItems.appendChild(this.cartItem);

            this.listeners();
            this.getGrandTotal();
        });
    }

    listeners() {
        this.removeBtn.addEventListener("click", this.removeItems.bind(this), false);
        this.cartAmount.addEventListener("click", this.getAmounts.bind(this), false);
        this.amountInput.addEventListener("change", this.getAmounts.bind(this));
    }

    getAmounts(e) {
        const products = [...addToCart.getFromStorage()];
        const targetId = e.target.dataset.countid;
        const amount = e.target.parentElement.querySelector(".amount");
        const itemColor = e.target.parentElement.parentElement.querySelector(".cart-name").textContent.split(" - ")[1];
        const totalPrice = e.target.parentElement.parentElement.querySelector(".cart-total-price");

        products.forEach(product => {
            if (targetId == product.id && itemColor === product.color) {
                if (e.target.classList.contains("count-minus")) {
                    amount.value--;
                    product.qty = parseInt(amount.value);
                    if (amount.value <= 1) {
                        amount.value = 1;
                        product.qty = 1;
                    }
                    totalPrice.textContent = this.multiple(product.price, product.qty);

                } else if (e.target.classList.contains("count-plus")) {
                    amount.value++;
                    product.qty = parseInt(amount.value);
                    if (amount.value > product.inStock) {
                        amount.value = product.inStock;
                        product.qty = product.inStock;
                    }
                    totalPrice.textContent = this.multiple(product.price, product.qty);

                } else if (e.target.classList.contains("amount")) {
                    product.qty = parseInt(amount.value);
                    if (amount.value > product.inStock) {
                        amount.value = product.inStock;
                        product.qty = product.inStock;
                    } else if (amount.value <= 1 || isNaN(amount.value)) {
                        amount.value = 1;
                        product.qty = 1;
                    }
                    totalPrice.textContent = this.multiple(product.price, product.qty);
                }
            }
        });

        localStorage.setItem("products", JSON.stringify(products));
        ui.showCartCounter();
        this.getGrandTotal();
    }

    getGrandTotal() {
        const grandTotal = this.showCart.querySelector(".grand-total");
        const totalPrices = [...this.showCart.querySelectorAll(".cart-total-price")];
        let totalArray = [];

        if (totalPrices.length > 0) {
            totalPrices.forEach(price => totalArray.push(Number(price.textContent)));
            const grandprice = totalArray.reduce((prev, curr) => prev + curr);
            grandTotal.textContent = grandprice.toFixed(2);
        } else {
            grandTotal.textContent = 0;
        }
    }

    multiple(price, qty) {
        let sum = qty * price;
        sum = sum.toFixed(2);
        return sum;
    }

    removeItems(e) {
        const products = [...addToCart.getFromStorage()];
        const id = e.target.dataset.id;

        products.forEach((item, index) => {
            if (item.id == id) {
                e.target.parentElement.parentElement.remove();
                products.splice(index, 1)
            }
        })

        localStorage.setItem("products", JSON.stringify(products));
        ui.showCartCounter();
        this.getGrandTotal();
    }
}