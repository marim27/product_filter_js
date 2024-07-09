document.addEventListener('DOMContentLoaded', () => {

    const products = [];
    let filteredProducts = [];
    const categories = new Set(); //use Set to Store unique categories for the filter
    const brands = new Set();
    let selectedBrands = ''; // Store selected brand for filtering
    let selectedCategory = '';
    let minPrice = '';
    let maxPrice = '';
    let sortOption = '';

    const productList = document.getElementById('productList');
    const categorySelect = document.getElementById('category');
    const brandsSelect = document.getElementById('brand');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const sortOptionSelect = document.getElementById('sortOption');
    const clearFiltersButton = document.getElementById('clearFilters');

    // Fetch products data from JSON file
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            products.push(...data);
            // Extract unique categories & brands from the products data
            data.forEach(product => {
                categories.add(product.category);
                brands.add(product.brand);
            });
            // Populate the category & brand dropdowns
            populateSelect(categorySelect, [...categories]);
            populateSelect(brandsSelect, [...brands]);
            filterAndRenderProducts(); // Initial rendering of products
        })
        .catch(error => console.error('Error fetching products data :', error));

    //populate a select element with options
    const populateSelect = (selectElement, options) => {
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
    };
    // Function to render products
    const renderProducts = () => {
        productList.innerHTML = ''; // Clear current products list
        if (filteredProducts.length === 0) {
            productList.innerHTML = '<p>No results found</p>';
        } else {
            filteredProducts.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.className = 'product';
                productDiv.innerHTML = `
                <h3>${product.name}</h3>
                <p>Price: $${product.price.toFixed(2)}</p>
                <p>Category: ${product.category}</p>
                <p>Brand: ${product.brand}</p>
            `;
                productList.appendChild(productDiv);
            });
        }
    };

    //filter & render products
    const filterAndRenderProducts = () => {
        // Convert price inputs to numbers, default to 0 and Infinity if not provided
        const min = parseFloat(minPrice) || 0;
        const max = parseFloat(maxPrice) || Infinity;
        filteredProducts = products.filter(product => {
            const matchesCategory = !selectedCategory || product.category === selectedCategory;
            const matchesBrand = !selectedBrands || product.brand === selectedBrands;
            const matchesPrice = product.price >= min && product.price <= max;
            return matchesCategory && matchesPrice && matchesBrand;
        });
        if (sortOption === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'name-asc') {
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortOption === 'name-desc') {
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        }
        renderProducts(); // Render the filtered products
    };

    // Event listeners for filter changes
    categorySelect.addEventListener('change', (e) => {
        selectedCategory = e.target.value;
        filterAndRenderProducts();
    });

    brandsSelect.addEventListener('change', (e) => {
        selectedBrands = e.target.value;
        filterAndRenderProducts();
    });

    minPriceInput.addEventListener('input', (e) => {
        minPrice = e.target.value;
        filterAndRenderProducts();
    });

    maxPriceInput.addEventListener('input', (e) => {
        maxPrice = e.target.value;
        filterAndRenderProducts();
    });

    sortOptionSelect.addEventListener('change', (e) => {
        sortOption = e.target.value;
        filterAndRenderProducts();
    });
    // Event listener for reset the filters to initial value
    clearFiltersButton.addEventListener('click', () => {
        selectedCategory = '';
        selectedBrands = '';
        minPrice = '';
        maxPrice = '';
        sortOption = '';
        categorySelect.value = '';
        brandsSelect.value = '';
        minPriceInput.value = '';
        maxPriceInput.value = '';
        sortOptionSelect.value = '';
        filterAndRenderProducts(); // Clear filters and render all products
    });
});
