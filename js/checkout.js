document.addEventListener("DOMContentLoaded", function() {
    var checkoutItems = document.getElementById("checkoutItems");
    var subtotalEl = document.getElementById("subtotal");
    var deliveryEl = document.getElementById("delivery");
    var taxEl = document.getElementById("tax");
    var totalEl = document.getElementById("orderTotal");
    var placeOrderBtn = document.getElementById("placeOrderBtn");
    var checkoutForm = document.getElementById("checkoutForm");

    auth.onAuthStateChanged(function(user) {
        if(!user) {
            window.location.href = "login.html";
            return;
        }

        if(document.getElementById("email")) {
            document.getElementById("email").value = user.email || "";
        }

        loadCheckout(user.uid);
    });

    function loadCheckout(userId) {
        db.collection("users").doc(userId).collection("cart").get().then(function(snapshot) {
            if(snapshot.empty) {
                if(checkoutItems) checkoutItems.innerHTML = "<li>Your cart is empty.</li>";
                if(subtotalEl) subtotalEl.textContent = "R0.00";
                if(deliveryEl) deliveryEl.textContent = "R0.00";
                if(taxEl) taxEl.textContent = "R0.00";
                if(totalEl) totalEl.textContent = "R0.00";
                if(placeOrderBtn) placeOrderBtn.disabled = true;
                return;
            }

            var items = [];
            var subtotal = 0;

            snapshot.forEach(function(doc) {
                var item = doc.data();
                var itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                items.push({
                    id: doc.id,
                    name: item.name,
                    quantity: item.quantity,
                    total: itemTotal
                });
            });

            if(checkoutItems) {
                checkoutItems.innerHTML = items.map(function(item) {
                    return `<li><span>${item.name} x ${item.quantity}</span><span>R${item.total.toFixed(2)}</span></li>`;
                }).join("");
            }

            var delivery = 90;
            var tax = subtotal * 0.15;
            var total = subtotal + delivery + tax;

            if(subtotalEl) subtotalEl.textContent = "R" + subtotal.toFixed(2);
            if(deliveryEl) deliveryEl.textContent = "R" + delivery.toFixed(2);
            if(taxEl) taxEl.textContent = "R" + tax.toFixed(2);
            if(totalEl) totalEl.textContent = "R" + total.toFixed(2);
            if(placeOrderBtn) placeOrderBtn.disabled = false;
        }).catch(function(error) {
            console.error("Error loading checkout:", error);
        });
    }

    if(placeOrderBtn) {
        placeOrderBtn.addEventListener("click", function() {
            if(checkoutForm && !checkoutForm.reportValidity()) {
                return;
            }

            auth.onAuthStateChanged(function(user) {
                if(!user) return;

                db.collection("users").doc(user.uid).collection("cart").get().then(function(snapshot) {
                    var orderItems = [];
                    snapshot.forEach(function(doc) {
                        orderItems.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });

                    return db.collection("orders").add({
                        userId: user.uid,
                        email: user.email,
                        items: orderItems,
                        total: totalEl ? Number(totalEl.textContent.replace(/[^0-9.-]+/g, "")) : 0,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        status: "Processing"
                    });
                }).then(function() {
                    return db.collection("users").doc(auth.currentUser.uid).collection("cart").get();
                }).then(function(snapshot) {
                    var batch = db.batch();
                    snapshot.forEach(function(doc) {
                        batch.delete(doc.ref);
                    });
                    return batch.commit();
                }).then(function() {
                    alert("Order placed successfully!");
                    if(window.updateCartCount) window.updateCartCount();
                    window.location.href = "shop.html";
                }).catch(function(error) {
                    console.error("Error placing order:", error);
                    alert("There was a problem placing your order. Please try again.");
                });
            });
        });
    }
});
