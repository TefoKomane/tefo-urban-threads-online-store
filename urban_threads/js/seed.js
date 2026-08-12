var products = [
    {
        name: "Oversized Hoodie",
        price: 49.99,
        category: "Hoodies",
        description: "Soft cotton hoodie in oversized fit. Perfect for layering.",
        imageURL: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"
    },
    {
        name: "Vintage Hoodie",
        price: 54.99,
        category: "Hoodies",
        description: "Retro styled hoodie with washed finish and front pocket.",
        imageURL: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=400"
    },
    {
        name: "Graphic Street Tee",
        price: 29.99,
        category: "T-shirts",
        description: "Bold graphic print on premium cotton tee.",
        imageURL: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400"
    },
    {
        name: "Classic Logo Tee",
        price: 24.99,
        category: "T-shirts",
        description: "Minimal logo tee for everyday wear.",
        imageURL: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400"
    },
    {
        name: "Urban Runner Sneakers",
        price: 89.99,
        category: "Sneakers",
        description: "Lightweight street sneakers with cushioned sole.",
        imageURL: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
    },
    {
        name: "High Top Kicks",
        price: 99.99,
        category: "Sneakers",
        description: "Classic high top design with modern comfort.",
        imageURL: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400"
    },
    {
        name: "Dad Cap",
        price: 24.99,
        category: "Accessories",
        description: "Adjustable cap with embroidered logo.",
        imageURL: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400"
    },
    {
        name: "Chain Necklace",
        price: 19.99,
        category: "Accessories",
        description: "Stainless steel chain to complete your look.",
        imageURL: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400"
    }
];

products.forEach(function(product) {
    db.collection("products").add(product)
        .then(function() {
            console.log("Added:", product.name);
        })
        .catch(function(error) {
            console.error("Error adding", product.name, error);
        });
});

console.log("Seeding started. Check console for results.");