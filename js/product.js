document.addEventListener("DOMContentLoaded", function() {
    var productDetail = document.getElementById("productDetail");
    var productId = new URLSearchParams(window.location.search).get("id");

    if(!productId) {
        productDetail.innerHTML = "<p>Product not found.</p>";
        return;
    }

    db.collection("products").doc(productId).get().then(function(doc) {
        if(!doc.exists) {
            productDetail.innerHTML = "<p>Product not found.</p>";
            return;
        }

        var product = doc.data();
        productDetail.innerHTML = `
            <div class="productDetailCard">
                <div class="productDetailImageWrap">
                    <img src="${product.imageURL}" alt="${product.name}" class="productDetailImage" onerror="this.src='https://via.placeholder.com/700x900/333/fff?text=No+Image'">
                </div>
                <div class="productDetailInfo">
                    <div class="category">${product.category}</div>
                    <h1>${product.name}</h1>
                    <div class="price">R${Number(product.price || 0).toFixed(2)}</div>
                    <p class="productDescription">${product.description}</p>
                    <div class="detailActions">
                        <button class="btn addToCartBtn" data-id="${doc.id}">Add to Cart</button>
                        <a href="shop.html" class="secondaryBtn">Continue Shopping</a>
                    </div>
                </div>
            </div>
        `;

        var addToCartBtn = productDetail.querySelector(".addToCartBtn");
        if(addToCartBtn) {
            addToCartBtn.addEventListener("click", function() {
                addToCart(doc.id);
            });
        }
    }).catch(function(error) {
        console.error("Error loading product details:", error);
        productDetail.innerHTML = "<p>Unable to load product details.</p>";
    });

    function addToCart(productId) {
        var user = auth.currentUser;

        if(!user) {
            window.showToast && window.showToast("Please log in to add items to your cart", "error");
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
                }

                return cartRef.set({
                    name: product.name,
                    price: product.price,
                    imageURL: product.imageURL,
                    quantity: 1,
                    addedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        }).then(function() {
            window.showToast && window.showToast("Item added to cart", "success");
            if(window.updateCartCount) {
                window.updateCartCount();
            }
        }).catch(function(error) {
            console.error("Error adding to cart:", error);
        });
    }
});
