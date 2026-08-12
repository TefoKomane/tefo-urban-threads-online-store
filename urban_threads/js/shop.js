document.addEventListener("DOMContentLoaded", function() {
    var productGrid = document.getElementById("productGrid");
    var filterBtns = document.querySelectorAll(".filterBtn");

    function loadProducts(category) {
        productGrid.innerHTML = "<p>Loading products...</p>";

        var query = db.collection("products");
        if(category !== "all") {
            query = query.where("category", "==", category);
        }

        query.get().then(function(snapshot) {
            productGrid.innerHTML = "";

            if(snapshot.empty) {
                productGrid.innerHTML = "<p>No products found.</p>";
                return;
            }

            snapshot.forEach(function(doc) {
                var product = doc.data();
                var card = document.createElement("div");
                card.className = "productCard";
                card.innerHTML = `
                    <img src="${product.imageURL}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x400/333/fff?text=No+Image'">
                    <div class="productInfo">
                        <div class="category">${product.category}</div>
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <div class="price">$${product.price.toFixed(2)}</div>
                        <button class="btn addToCartBtn" data-id="${doc.id}">Add to Cart</button>
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
        if(!user) {
            alert("Please log in to add items to your cart");
            window.location.href = "login.html";
            return;
        }

        db.collection("products").doc(productId).get().then(function(doc) {
            if(!doc.exists) return;
            var product = doc.data();
            var cartRef = db.collection("users").doc(user.uid).collection("cart").doc(productId);

            return cartRef.get().then(function(cartDoc) {
                if(cartDoc.exists) {
                    return cartRef.update({
                        quantity: cartDoc.data().quantity + 1
                    });
                } else {
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
            alert("Item added to cart");
        }).catch(function(error) {
            console.error("Error adding to cart:", error);
        });
    }

    filterBtns.forEach(function(btn) {
        btn.addEventListener("click", function() {
            filterBtns.forEach(function(b) { b.classList.remove("active"); });
            this.classList.add("active");
            loadProducts(this.getAttribute("data_category"));
        });
    });

    loadProducts("all");
});