class UI {
    constructor() {
        this.imagesHoldor = document.getElementById("images-tab-holder");
        this.colorsHoldor = document.getElementById("colors-list-holodor");

        this.allProductBtn = document.getElementById("all-product");

        this.categoryHolder = document.getElementById("category-holder");
        this.productHolder = document.getElementById("product-holder");
        this.categoryTemplate = document.getElementById("category-template");
        this.productTemplate = document.getElementById("product-template");
        this.cartCount = document.querySelector(".cart-counter");

        this.cardTemplate = document.getElementById("card-template");
        this.productCardHolder = document.getElementById("product-card-holder");

        this.cartTemplate = document.getElementById("cart-template");
        this.showCart = document.getElementById("show-cart");

        this.cartBtn = document.querySelector(".show-cart-btn");

        this.imagesTabArray = [];
        this.colorsImageArray = [];
        this.categoriesArray = [];
        this.pricesArray = [];
        this.colorsArray = [];
        this.colorAndId = [];
    }

    // Set attribute function
    setAttributes(elem, attrs) {
        for (let key in attrs) {
            elem.setAttribute(key, attrs[key]);
        }
    }

    getItems(items) {
        items.map((item, index) => {
            // Push item category to array
            this.categoriesArray.push(item.category);

            // Get all price
            this.pricesArray.push(item.price);

            // Check product id for get color name and image source
            if (item.id === 7) {
                for (const key in item.imagesColor) {
                    // Push color name and image source to array
                    this.colorsImageArray.push({
                        key,
                        source: item.imagesColor[key]
                    })
                }
                this.colorsTab();
                this.imagesTab();
            }

            // GET ALL COLORS AND PUSH TO ARRAY
            for (const color in item.imagesColor) {
                this.colorAndId.push({
                    color,
                    id: item.id
                })
                this.colorsArray.push(color)
            }
        })
        this.displaySidebarGategories(items);
        this.displaySidebarRange();
        this.displaySidebarColors(items);
        this.displayProduct(items);
        this.showModalCard();
        this.showModalCart();
        this.getCartPage();
        this.showCartCounter();

        this.cartBtn.addEventListener("click", this.getCartPage.bind(this));
        this.allProductBtn.addEventListener("click", this.displayCategoryItems.bind(this, items));
    }

    // Template handlebars
    colorsTab() {
        // Loop in colors for product
        this.colorsImageArray.forEach((item, index) => {
            // Create color link, color spot and color name element for each item 
            const colorItem = document.createElement("li"),
                colorLink = document.createElement("a"),
                colorSpot = document.createElement("span"),
                colorName = document.createElement("span");

            // Add class name to each new elements
            colorSpot.classList.add("color-spot");
            colorName.classList.add("color-name");
            colorLink.classList.add("nav-item");
            colorItem.classList.add("color-item", "nav-item")

            // inner color name to element
            colorName.textContent = item.key;

            // Set back ground color to each color spot
            colorSpot.style.backgroundColor = item.key

            // Set attributes to elements
            colorItem.setAttribute("role", "presentation");
            this.setAttributes(colorLink, {
                "href": `#pills-${index + 1}`,
                "id": `pills-tab-${index + 1}`,
                "aria-controls": `pills-${index + 1}`,
                "data-bs-toggle": "tab",
                "role": "tab",
                "aria-selected": false
            });

            // Append items to list
            colorItem.appendChild(colorLink);
            colorLink.appendChild(colorSpot);
            colorLink.appendChild(colorName);

            // Check first item for active
            if (index === 0) {
                colorLink.setAttribute("aria-selected", true)
                colorLink.classList.add("active")
            }
            // Append each items to list holdor
            this.colorsHoldor.appendChild(colorItem)
        })
    }

    // Display images for each color that user selected
    imagesTab() {
        // Loop in images for product
        this.colorsImageArray.forEach((image, index) => {

            // Create image holodor and image element
            const imageHoldor = document.createElement("div"),
                img = document.createElement("img");

            // Set attributes to image holodor elements
            this.setAttributes(imageHoldor, {
                "class": "images-tab tab-pane",
                "id": `pills-${index + 1}`,
                "role": "tabpane1",
                "aria-labelledby": `pills-tab-${index + 1}`
            })

            // Set attributes to image elements
            this.setAttributes(img, {
                "src": image.source,
                "alt": "product",
                "class": "img-fluid"
            });

            // Check first image for active
            index === 0 ? imageHoldor.classList.add("active") : index;

            // Append each image to image holdor
            imageHoldor.appendChild(img);

            // Append images element to images holdor
            this.imagesHoldor.appendChild(imageHoldor);
        })
    }

    displaySidebarGategories(items) {
        // GET ALL CATEGORY WITH REMOVE DUBLICATE
        const categories = [...this.removeDuplicateCategory(this.categoriesArray)];
        const categoryItem = this.categoryTemplate.content.querySelector(".category-item");
        const categoryList = this.categoryTemplate.content.querySelector(".category-list");
        // LOOP IN CATEGORY
        categories.forEach((category, index) => {
            const importCategoryItem = document.importNode(categoryItem, true);
            importCategoryItem.firstElementChild.textContent += category;
            this.categoryHolder.appendChild(importCategoryItem);

            // SET ATTRIBUTE TO EACH CAETEGORY FOR COLLAPSE
            this.setAttributes(importCategoryItem.firstElementChild, {
                "data-bs-toggle": "collapse",
                "data-bs-target": `#multiCollapse-${index}`,
                "aria-controls": `multiCollapse-${index}`,
                "data-category": category
            })

            if (index === 0) {
                importCategoryItem.firstElementChild.setAttribute("aria-expanded", true)
            } else {
                importCategoryItem.firstElementChild.setAttribute("aria-expanded", false)
            }

            // LOOP IN PRODUCTS
            items.forEach((item, itemIndex) => {
                if (item.category === category) {
                    const importCategoryList = document.importNode(categoryList, true);
                    const categoryListHolder = importCategoryItem.querySelector(".categories-list");
                    const multiCollapse = importCategoryItem.querySelector(".collapse");

                    importCategoryList.firstElementChild.textContent += item.name;
                    categoryListHolder.appendChild(importCategoryList);

                    // SET ATTRIBUTE TO EACH ITEM NAME FOR CARD
                    this.setAttributes(importCategoryList.firstElementChild, {
                        "data-bs-toggle": "modal",
                        "data-bs-target": `#card-modal`,
                        "data-id": item.id
                    })
                    multiCollapse.id = `multiCollapse-${index}`;

                    // Check first image for active
                    itemIndex === 0 ? multiCollapse.classList.add("show") : itemIndex;

                    importCategoryList.firstElementChild.addEventListener("click", this.getCardPage.bind(this, items));
                }
            })
            importCategoryItem.firstElementChild.addEventListener("click", this.displayCategoryItems.bind(this, category));
        })
    }

    displaySidebarRange() {
        const sidebarRange = this.categoryTemplate.content.querySelector(".sidebar-range");
        const importRange = document.importNode(sidebarRange, true);
        importRange.firstElementChild.textContent = "price";
        this.categoryHolder.appendChild(importRange);
    }

    changeRange(value) {
        const products = [...this.productHolder.querySelectorAll(".product")];
        const minPrice = value[0];
        const maxPrice = value[1];
        products.forEach(product =>{
            const price = product.querySelector(".price").textContent;

            if (minPrice >= price || maxPrice <= price) {
                product.style.display = "none";
            } else {
                product.style.display = "block";
            }
            if(minPrice === price || maxPrice === price) {
                product.style.display = "block";
            }
        })
    }

    displaySidebarColors(items) {
        const colors = this.removeDuplicateCategory(this.colorsArray);
        const sidebarColors = this.categoryTemplate.content.querySelector(".sidebar-colors");
        const importColors = document.importNode(sidebarColors, true);
        importColors.firstElementChild.textContent = "color";

        colors.forEach(color => {
            const colorsHolder = importColors.querySelector(".items-list")
            const colorName = document.createElement("li");
            const colorLink = document.createElement("p");
            const colorSpot = document.createElement("span");

            colorSpot.classList.add("spot");
            colorSpot.style.backgroundColor = color;
            colorName.classList.add("mb-2");
            colorLink.classList.add("color-link");
            colorLink.innerText = color;

            colorName.appendChild(colorLink);
            colorLink.appendChild(colorSpot);
            colorsHolder.appendChild(colorName);
            this.categoryHolder.appendChild(importColors);

            colorName.addEventListener("click", this.displayColorItems.bind(this, color));
        })
    }

    displayColorItems(color, e) {
        e.preventDefault();
        const products = [...this.productHolder.querySelectorAll(".product")];

        products.forEach(product => {
            const productName = product.querySelector(".product-name");
            product.style.display = "none";
            this.colorAndId.forEach(itemColor => {
                if (color === itemColor.color && productName.dataset.id == itemColor.id) {
                    // e.target.classList.add("active");
                    product.style.display = "block";
                }
            })
        })
    }

    displayCategoryItems(category, e) {
        const products = [...this.productHolder.querySelectorAll(".product")];

        products.forEach(products => {
            const productName = products.querySelector(".product-name");
            if (category !== productName.getAttribute("data-category")) {
                products.style.display = "none";
            } else {
                products.style.display = "block";
            }
            (e.target.id === "all-product") ? products.style.display = "block" : e;
        })
    }

    displayProduct(items) {
        const products = this.productTemplate.content.querySelector(".product");
        // LOOP IN ALL PRODUCTS FOR DISPLAY IN HTML
        items.map((item, index) => {
            const importProduct = document.importNode(products, true);
            const img = importProduct.querySelector(".product-img");
            const productName = importProduct.querySelector(".product-name");
            const productDesc = importProduct.querySelector(".description");
            const productPrice = importProduct.querySelector(".price");

            this.setAttributes(img, {
                "src": item.image,
                "alt": item.name,
                "data-id": item.id
            })

            this.setAttributes(productName, {
                "data-bs-toggle": "modal",
                "data-bs-target": `#card-modal`,
                "data-id": item.id,
                "data-category": item.category,
            })

            productName.textContent = item.name;
            productDesc.textContent = item.desc;
            productPrice.textContent = item.price.toFixed(2);

            this.productHolder.appendChild(importProduct);

            productName.addEventListener("click", this.getCardPage.bind(this, items));
        })
    }

    showModalCard() {
        const card = this.cardTemplate.content.querySelector(".card-template");
        const importCard = document.importNode(card, true);
        this.productCardHolder.appendChild(importCard);
    }

    showModalCart() {
        const cart = this.cartTemplate.content.querySelector(".cart-template");
        const importCart = document.importNode(cart, true);
        this.showCart.appendChild(importCart);
    }

    getCartPage() {
        cartPage.getCart();
    }

    getCardPage(items, e) {
        cardPage.getToCard(items, e);
    }

    showCard(items, productArticle) {
        const button = [...productArticle.querySelectorAll(".show-card-btn")];
        button.forEach(btn => {
            cardPage.addThumbnails(items, btn);
        })
    }

    showCartCounter() {
        const counter = addToCart.getCartCounter();
        this.cartCount.textContent = counter;
    }

    // remove duplicate category 
    removeDuplicateCategory(array) {
        return array.reduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], [])
    }

    // Get max price
    getMaxPrice() {
        (this.pricesArray.length === 0) ? undefined : this.pricesArray.length;
        return this.pricesArray.reduce((prev, cur) => (cur > prev) ? cur : prev);
    }

    // Get min price
    getMinPrice() {
        (this.pricesArray.length === 0) ? undefined : this.pricesArray.length;
        return this.pricesArray.reduce((prev, cur) => (cur < prev) ? cur : prev)
    }
}