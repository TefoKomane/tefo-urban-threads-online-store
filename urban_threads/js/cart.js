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
        loadCart(user.uid);
    });

    function loadCart(userId) {
        db.collection("users").doc(userId).collection("cart").get()
            .then(function(snapshot) {
                var tbody = cartTable.querySelector("tbody");
                tbody.innerHTML = "";

                if(snapshot.empty) {
                    cartTable.style.display = "none";
                    emptyCart.style.display = "block";
                    cartTotal.textContent = "Total: $0.00";
                    if(checkoutBtn) checkoutBtn.style.display = "none";
                    return;
                }

                cartTable.style.display = "table";
                emptyCart.style.display = "none";
                if(checkoutBtn) checkoutBtn.style.display = "inline-block";

                var total = 0;

                snapshot.forEach(function(doc) {
                    var item = doc.data();
                    total += item.price * item.quantity;

                    var row = document.createElement("tr");
                    row.innerHTML = `
                        <td><img src="${item.imageURL}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;" onerror="this.src='https://via.placeholder.com/60/333/fff?text=No+Image'"></td>
                        <td>${item.name}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td>${item.quantity}</td>
                        <td>$${(item.price * item.quantity).toFixed(2)}</td>
                        <td><button class="btn removeBtn" style="padding:0.4rem 0.8rem;font-size:0.85rem;">Remove</button></td>
                    `;

                    row.querySelector(".removeBtn").addEventListener("click", function() {
                        removeFromCart(userId, doc.id);
                    });

                    tbody.appendChild(row);
                });

                cartTotal.textContent = "Total: $" + total.toFixed(2);
            })
            .catch(function(error) {
                console.error("Error loading cart:", error);
            });
    }

    function removeFromCart(userId, itemId) {
        db.collection("users").doc(userId).collection("cart").doc(itemId).delete()
            .then(function() {
                loadCart(userId);
            })
            .catch(function(error) {
                console.error("Error removing item:", error);
            });
    }

    if(checkoutBtn) {
        checkoutBtn.addEventListener("click", function() {
            alert("Checkout feature coming soon. Thank you for shopping with Urban Threads.");
        });
    }
});