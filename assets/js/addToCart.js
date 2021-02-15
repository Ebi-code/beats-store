class AddToCart {

    constructor() {
        this.productCardHolder = document.getElementById("product-card-holder");
        this.counterArray = [];
    }
    getProduct(product) {
        this.productInformation(product);
        ui.showCartCounter();
    }

    productInformation(product) {
        let color = this.productCardHolder.querySelector(".color").value;
        let { name, id, image, price , desc, inStock} = product;
        let qty = this.getAmountValue();
         
        let selectProduct = {
            name,
            qty,
            color,
            price,
            id,
            image,
            desc,
            inStock
        }
        this.saveToStorage(selectProduct);
    }
    
    saveToStorage(product) {
        const products = [...this.getFromStorage()];
        const existItem = products.findIndex(item => item.id == product.id && item.color === product.color);
        let qty = this.getAmountValue();

        if (existItem < 0) {
            products.push(product);
        } else {
            products[existItem].qty = qty;
        }
        localStorage.setItem("products", JSON.stringify(products));
    }

    getAmountValue(){
        let qty;
        let array = [...this.productCardHolder.querySelectorAll(".amount")];
        array.forEach(arrValue => (!isNaN(arrValue.value) && arrValue.value !== "") ? qty = parseInt(arrValue.value) : 1);
        return qty;
    }

    getFromStorage() {
        let product;
        const output = localStorage.getItem("products");
        if (output !== null) {
            product = JSON.parse(output);
        } else {
            product = [];
        }
        return product;
    }

    getCartCounter() {
        const products = [...this.getFromStorage()];
        let cartAmount = [];
        let amount = 0;
        if (products.length > 0) {
            products.forEach(product => {
                cartAmount.push(product.qty);
            })
            amount = cartAmount.reduce((prev, curr) => prev + curr);
        }
        return amount;
    }
}