class LoadJSON {
    // Load JSON file
    async fetchJson() {
        try {
            const response = await fetch("../assets/json/products.json");
            const result = await response.json();
            return result.items;
        } catch (error) {
            console.log(error);
        }
    }
}