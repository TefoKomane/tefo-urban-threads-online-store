document.addEventListener("DOMContentLoaded", function() {
    var cartTable = document.getElementById("cartTable");
    var emptyCart = document.getElementById("emptyCart");
    var cartTotal = document.getElementById("cartTotal");
    var checkoutBtn = document.getElementById("checkoutBtn");

    auth.onAuthStateChanged(function(user) {
        if(!user) {
            window.location.href = "login.html";
            return;
        }
        window.updateCartCount();
        loadCart(user.uid);
    });

    function loadCart(userId) {
        console.log("Loading cart for user:", userId);
        db.collection("users").doc(userId).collection("cart").get()
            .then(function(snapshot) {
                console.log("Cart snapshot received. Empty:", snapshot.empty, "Size:", snapshot.size);
                var tbody = cartTable.querySelector("tbody");
                tbody.innerHTML = "";

                if(snapshot.empty) {
                    console.log("Cart is empty");
                    cartTable.style.display = "none";
                    emptyCart.style.display = "block";
                    cartTotal.textContent = "Total: R0.00";
                    if(checkoutBtn) checkoutBtn.style.display = "none";
                    return;
                }

                cartTable.style.display = "table";
                emptyCart.style.display = "none";
                if(checkoutBtn) checkoutBtn.style.display = "inline-block";

                var total = 0;

                snapshot.forEach(function(doc) {
                    console.log("Cart item:", doc.id, doc.data());
                    var item = doc.data();
                    total += item.price * item.quantity;

                    var row = document.createElement("tr");
                    row.innerHTML = `
                        <td><img src="${item.imageURL}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;" onerror="this.src='https://via.placeholder.com/60/333/fff?text=No+Image'"></td>
                        <td>${item.name}</td>
                        <td>R${item.price.toFixed(2)}</td>
                        <td>
                            <div class="qtyControls">
                                <button class="qtyBtn minusBtn" data-id="${doc.id}">-</button>
                                <span class="qtyValue">${item.quantity}</span>
                                <button class="qtyBtn plusBtn" data-id="${doc.id}">+</button>
                            </div>
                        </td>
                        <td>R${(item.price * item.quantity).toFixed(2)}</td>
                        <td><button class="btn removeBtn" style="padding:0.4rem 0.8rem;font-size:0.85rem;">Remove</button></td>
                    `;

                    row.querySelector(".removeBtn").addEventListener("click", function() {
                        removeFromCart(userId, doc.id);
                    });

                    row.querySelector(".minusBtn").addEventListener("click", function() {
                        updateQuantity(userId, doc.id, -1);
                    });

                    row.querySelector(".plusBtn").addEventListener("click", function() {
                        updateQuantity(userId, doc.id, 1);
                    });

                    tbody.appendChild(row);
                });

                cartTotal.textContent = "Total: R" + total.toFixed(2);
            })
            .catch(function(error) {
                console.error("Error loading cart:", error);
            });
    }

    function removeFromCart(userId, itemId) {
        db.collection("users").doc(userId).collection("cart").doc(itemId).delete()
            .then(function() {
                window.updateCartCount();
                loadCart(userId);
            })
            .catch(function(error) {
                console.error("Error removing item:", error);
            });
    }

    function updateQuantity(userId, itemId, change) {
        var cartItemRef = db.collection("users").doc(userId).collection("cart").doc(itemId);

        cartItemRef.get().then(function(doc) {
            if(!doc.exists) return;

            var currentQty = doc.data().quantity || 0;
            var newQty = currentQty + change;

            if(newQty <= 0) {
                return cartItemRef.delete();
            }

            return cartItemRef.update({ quantity: newQty });
        }).then(function() {
            window.updateCartCount();
            loadCart(userId);
        }).catch(function(error) {
            console.error("Error updating quantity:", error);
        });
    }

    if(checkoutBtn) {
        checkoutBtn.addEventListener("click", function() {
            window.location.href = "checkout.html";
        });
    }
});