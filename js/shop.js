document.addEventListener("DOMContentLoaded", function() {
    var productGrid = document.getElementById("productGrid");
    var filterBtns = document.querySelectorAll(".filterBtn");
    var searchInput = document.getElementById("productSearch");
    var activeCategory = "all";

    function loadProducts(category, searchTerm) {
        productGrid.innerHTML = "<p>Loading products...</p>";

        var query = db.collection("products");
        if(category !== "all") {
            query = query.where("category", "==", category);
        }

        query.get().then(function(snapshot) {
            productGrid.innerHTML = "";

            var filteredProducts = [];
            snapshot.forEach(function(doc) {
                var product = doc.data();
                var matchesSearch = !searchTerm ||
                    (product.name && product.name.toLowerCase().includes(searchTerm)) ||
                    (product.description && product.description.toLowerCase().includes(searchTerm));

                if(matchesSearch) {
                    filteredProducts.push({ id: doc.id, product: product });
                }
            });

            if(filteredProducts.length === 0) {
                productGrid.innerHTML = "<p>No products found.</p>";
                return;
            }

            filteredProducts.forEach(function(item) {
                var product = item.product;
                var card = document.createElement("div");
                card.className = "productCard";
                card.innerHTML = `
                    <img src="${product.imageURL}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x400/333/fff?text=No+Image'">
                    <div class="productInfo">
                        <div class="category">${product.category}</div>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="price">R${product.price.toFixed(2)}</div>
                        <div class="detailActions">
                            <button class="btn addToCartBtn" data-id="${item.id}">Add to Cart</button>
                            <a href="product.html?id=${item.id}" class="secondaryBtn">View</a>
                        </div>
                    </div>
                `;
                productGrid.appendChild(card);
            });

            document.querySelectorAll(".addToCartBtn").forEach(function(btn) {
                btn.addEventListener("click", function() {
                    var productId = this.getAttribute("data-id");
                    addToCart(productId);
                });
            });
        }).catch(function(error) {
            console.error("Error loading products:", error);
            productGrid.innerHTML = "<p>Error loading products. Please try again.</p>";
        });
    }

    function addToCart(productId) {
        var user = auth.currentUser;
        console.log("Adding to cart. Current user:", user);
        if(!user) {
            window.showToast && window.showToast("Please log in to add items to your cart", "error");
            window.location.href = "login.html";
            return;
        }

        db.collection("products").doc(productId).get().then(function(doc) {
            if(!doc.exists) return;
            var product = doc.data();
            console.log("Product found:", product);
            var cartRef = db.collection("users").doc(user.uid).collection("cart").doc(productId);

            return cartRef.get().then(function(cartDoc) {
                if(cartDoc.exists) {
                    console.log("Item already in cart, updating quantity");
                    return cartRef.update({
                        quantity: cartDoc.data().quantity + 1
                    });
                } else {
                    console.log("New item, adding to cart");
                    return cartRef.set({
                        name: product.name,
                        price: product.price,
                        imageURL: product.imageURL,
                        quantity: 1,
                        addedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            });
        }).then(function() {
            window.showToast && window.showToast("Item added to cart", "success");
            window.updateCartCount();
        }).catch(function(error) {
            console.error("Error adding to cart:", error);
        });
    }

    filterBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            filterBtns.forEach(function(b) { b.classList.remove("active"); });
            this.classList.add("active");
            activeCategory = this.getAttribute("data-category");
            loadProducts(activeCategory, searchInput.value.trim().toLowerCase());
        });
    });

    if(searchInput) {
        searchInput.addEventListener("input", function() {
            loadProducts(activeCategory, this.value.trim().toLowerCase());
        });
    }

    loadProducts(activeCategory, "");
});