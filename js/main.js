document.addEventListener("DOMContentLoaded", function() {
    var featuredGrid = document.getElementById("featuredGrid");

    if(featuredGrid) {
        db.collection("products").limit(4).get().then(function(snapshot) {
            featuredGrid.innerHTML = "";

            snapshot.forEach(function(doc) {
                var product = doc.data();
                var card = document.createElement("div");
                card.className = "productCard";
                card.innerHTML = `
                    <img src="${product.imageURL}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x400/333/fff?text=No+Image'">
                    <div class="productInfo">
                        <div class="category">${product.category}</div>
                        <h3>${product.name}</h3>
                        <div class="price">R${product.price.toFixed(2)}</div>
                        <a href="shop.html" class="btn">View in Shop</a>
                    </div>
                `;
                featuredGrid.appendChild(card);
            });
        }).catch(function(error) {
            console.error("Error loading featured products:", error);
            featuredGrid.innerHTML = "<p>Unable to load featured products.</p>";
        });
    }
});