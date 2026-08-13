document.addEventListener("DOMContentLoaded", function() {
    var loginForm = document.getElementById("loginForm");
    var signupForm = document.getElementById("signupForm");
    var authToggle = document.getElementById("authToggle");
    var formTitle = document.getElementById("formTitle");
    var authMessage = document.getElementById("authMessage");

    var isLogin = true;

    if(authToggle) {
        authToggle.addEventListener("click", function() {
            isLogin = !isLogin;
            if(isLogin) {
                formTitle.textContent = "Log In";
                loginForm.style.display = "block";
                signupForm.style.display = "none";
                authToggle.textContent = "Need an account? Sign Up";
            } else {
                formTitle.textContent = "Sign Up";
                loginForm.style.display = "none";
                signupForm.style.display = "block";
                authToggle.textContent = "Already have an account? Log In";
            }
        });
    }

    if(loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            var email = document.getElementById("loginEmail").value;
            var password = document.getElementById("loginPassword").value;

            auth.signInWithEmailAndPassword(email, password)
                .then(function() {
                    window.location.href = "shop.html";
                })
                .catch(function(error) {
                    authMessage.textContent = error.message;
                    authMessage.style.color = "#e74c3c";
                });
        });
    }

    if(signupForm) {
        signupForm.addEventListener("submit", function(e) {
            e.preventDefault();
            var email = document.getElementById("signupEmail").value;
            var password = document.getElementById("signupPassword").value;
            var name = document.getElementById("signupName").value;

            auth.createUserWithEmailAndPassword(email, password)
                .then(function(cred) {
                    return db.collection("users").doc(cred.user.uid).set({
                        name: name,
                        email: email,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                })
                .then(function() {
                    window.location.href = "shop.html";
                })
                .catch(function(error) {
                    authMessage.textContent = error.message;
                    authMessage.style.color = "#e74c3c";
                });
        });
    }

    var userDisplay = document.getElementById("userDisplay");
    var logoutBtn = document.getElementById("logoutBtn");
    var loginLink = document.getElementById("loginLink");
    var cartLink = document.getElementById("cartLink");

    auth.onAuthStateChanged(function(user) {
        if(user) {
            if(userDisplay) userDisplay.textContent = user.email;
            if(logoutBtn) logoutBtn.style.display = "inline-block";
            if(loginLink) loginLink.style.display = "none";
            if(cartLink) cartLink.style.display = "inline-block";
        } else {
            if(userDisplay) userDisplay.textContent = "";
            if(logoutBtn) logoutBtn.style.display = "none";
            if(loginLink) loginLink.style.display = "inline-block";
            if(cartLink) cartLink.style.display = "none";
        }
    });

    if(logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            auth.signOut().then(function() {
                window.location.href = "index.html";
            });
        });
    }

    // Function to update cart counter
    window.updateCartCount = function() {
        var user = auth.currentUser;
        if(!user) {
            var cartCount = document.getElementById("cartCount");
            if(cartCount) cartCount.textContent = "0";
            return;
        }
        
        db.collection("users").doc(user.uid).collection("cart").get()
            .then(function(snapshot) {
                var count = snapshot.size;
                var cartCount = document.getElementById("cartCount");
                if(cartCount) {
                    cartCount.textContent = count;
                    cartCount.style.display = count > 0 ? "inline-block" : "none";
                }
            })
            .catch(function(error) {
                console.error("Error updating cart count:", error);
            });
    };

    // Update cart count on page load
    auth.onAuthStateChanged(function(user) {
        window.updateCartCount();
    });
});