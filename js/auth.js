document.addEventListener("DOMContentLoaded", function() {
    var toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className = "toastContainer";
    document.body.appendChild(toastContainer);

    window.showToast = function(message, type) {
        var toast = document.createElement("div");
        toast.className = "toast " + (type || "success");
        toast.textContent = message;
        toastContainer.appendChild(toast);

        setTimeout(function() {
            toast.classList.add("show");
        }, 10);

        setTimeout(function() {
            toast.classList.remove("show");
            setTimeout(function() {
                toast.remove();
            }, 300);
        }, 2600);
    };

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
    var userDropdown = document.getElementById("userDropdown");
    var userEmail = document.getElementById("userEmail");
    var userName = document.getElementById("userName");
    var mobileMenuToggle = document.querySelector(".mobileMenuToggle");
    var navbar = document.querySelector(".navbar");

    if(mobileMenuToggle && navbar) {
        mobileMenuToggle.addEventListener("click", function() {
            navbar.classList.toggle("navOpen");
        });
    }

    document.addEventListener("click", function(e) {
        if(window.innerWidth <= 820 && navbar && !e.target.closest(".navbar")) {
            navbar.classList.remove("navOpen");
        }
    });

    auth.onAuthStateChanged(function(user) {
        if(user) {
            // Show profile dropdown, hide login link
            if(userDropdown) userDropdown.style.display = "inline-block";
            if(loginLink) loginLink.style.display = "none";
            if(cartLink) cartLink.style.display = "inline-flex";
            
            // Get user profile from Firestore to display name
            db.collection("users").doc(user.uid).get().then(function(doc) {
                if(doc.exists) {
                    if(userName) userName.textContent = doc.data().name || user.email;
                }
            }).catch(function(error) {
                console.error("Error getting user profile:", error);
                if(userName) userName.textContent = user.email;
            });
            
            // Display email in dropdown
            if(userEmail) userEmail.textContent = user.email;
        } else {
            // Hide profile dropdown, show login link
            if(userDropdown) userDropdown.style.display = "none";
            if(loginLink) loginLink.style.display = "inline-flex";
            if(cartLink) cartLink.style.display = "none";
            if(userEmail) userEmail.textContent = "";
            if(userName) userName.textContent = "";
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

    // Dropdown toggle functionality
    var dropdownToggle = document.querySelector(".dropdownToggle");
    var dropdownMenu = document.querySelector(".dropdownMenu");
    
    if(dropdownToggle) {
        dropdownToggle.addEventListener("click", function(e) {
            e.stopPropagation();
            if(dropdownMenu) {
                dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
            }
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener("click", function(e) {
        if(!e.target.closest(".userDropdown")) {
            if(dropdownMenu) dropdownMenu.style.display = "none";
        }
    });

    // Update cart count on page load
    auth.onAuthStateChanged(function(user) {
        window.updateCartCount();
    });
});