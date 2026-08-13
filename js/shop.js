document.addEventListener("DOMContentLoaded", function() {
    var productGrid = document.getElementById("productGrid");
    var filterBtns = document.querySelectorAll(".filterBtn");
    var searchInput = document.getElementById("productSearch");
    var sortSelect = document.getElementById("sortProducts");
    var activeCategory = "all";
    var activeSort = "featured";

    function sortProducts(list, sortBy) {
        var sorted = list.slice();

        if(sortBy === "newest") {
            sorted.sort(function(a, b) {
                var aDate = a.product.createdAt && a.product.createdAt.seconds ? a.product.createdAt.seconds : 0;
                var bDate = b.product.createdAt && b.product.createdAt.seconds ? b.product.createdAt.seconds : 0;
                return bDate - aDate;
            });
        } else if(sortBy === "price-low") {
            sorted.sort(function(a, b) {
                return Number(a.product.price) - Number(b.product.price);
            });
        } else if(sortBy === "price-high") {
            sorted.sort(function(a, b) {
                return Number(b.product.price) - Number(a.product.price);
            });
        }

        return sorted;
    }

    function loadProducts(category, searchTerm) {
        productGrid.innerHTML = "<p>Loading products...</p>";

        var user = auth.currentUser;
        var wishlistPromise = user ? db.collection("users").doc(user.uid).collection("wishlist").get() : Promise.resolve({ docs: [] });

        var query = db.collection("products");
        if(category !== "all") {
            query = query.where("category", "==", category);
        }

        Promise.all([query.get(), wishlistPromise]).then(function(results) {
            productGrid.innerHTML = "";
            var snapshot = results[0];
            var wishlistSnapshot = results[1];
            var wishlistIds = {};

            if(wishlistSnapshot && wishlistSnapshot.docs) {
                wishlistSnapshot.docs.forEach(function(doc) {
                    wishlistIds[doc.id] = true;
                });
            }

            var filteredProducts = [];
            snapshot.forEach(function(doc) {
                var product = doc.data();
                var matchesSearch = !searchTerm ||
                    (product.name && product.name.toLowerCase().includes(searchTerm)) ||
                    (product.description && product.description.toLowerCase().includes(searchTerm));

                if(matchesSearch) {
                    filteredProducts.push({ id: doc.id, product: product, isFavorite: !!wishlistIds[doc.id] });
                }
            });

            if(filteredProducts.length === 0) {
                productGrid.innerHTML = "<p>No products found.</p>";
                return;
            }

            var sortedProducts = sortProducts(filteredProducts, activeSort);

            sortedProducts.forEach(function(item) {
                var product = item.product;
                var card = document.createElement("div");
                card.className = "productCard";
                card.innerHTML = `
                    <div class="productImageWrap">
                        <img src="${product.imageURL}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x400/333/fff?text=No+Image'">
                        <button class="wishlistBtn ${item.isFavorite ? 'active' : ''}" data-id="${item.id}" aria-label="Add to wishlist">
                            ${item.isFavorite ? '♥' : '♡'}
                        </button>
                    </div>
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

            document.querySelectorAll(".wishlistBtn").forEach(function(btn) {
                btn.addEventListener("click", function() {
                    toggleWishlist(this.getAttribute("data-id"), this);
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

    function toggleWishlist(productId, btn) {
        var user = auth.currentUser;

        if(!user) {
            window.showToast && window.showToast("Please log in to save favourites", "error");
            window.location.href = "login.html";
            return;
        }

        var wishlistRef = db.collection("users").doc(user.uid).collection("wishlist").doc(productId);

        wishlistRef.get().then(function(doc) {
            if(doc.exists) {
                return wishlistRef.delete();
            }
            return wishlistRef.set({
                addedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }).then(function() {
            var isActive = btn.classList.toggle("active");
            btn.textContent = isActive ? "♥" : "♡";
            window.showToast && window.showToast(isActive ? "Saved to favourites" : "Removed from favourites", "success");
        }).catch(function(error) {
            console.error("Error toggling wishlist:", error);
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

    if(sortSelect) {
        sortSelect.addEventListener("change", function() {
            activeSort = this.value;
            loadProducts(activeCategory, searchInput.value.trim().toLowerCase());
        });
    }

    loadProducts(activeCategory, "");
});