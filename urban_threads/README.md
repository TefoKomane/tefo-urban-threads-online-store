# Urban Threads

An online streetwear store built with HTML, CSS, JavaScript, Firebase Authentication, and Firebase Firestore.

## Created By
Tefo Karabo Komane
GitHub: https://github.com/TefoKomane

## Live Demo
[Netlify Link will go here after deployment]

## Features

### Authentication
Users can sign up, log in, and log out using Firebase Authentication with email and password.
Only logged in users can view the cart or checkout.
The navbar displays the logged in user's email.

### Product Catalog
Products are stored in Firebase Firestore and loaded dynamically.
Categories include Hoodies, T-shirts, Sneakers, and Accessories.
Users can filter products by category.

### Shopping Cart
Logged in users can add items to their cart.
Cart data is saved under each user's document in Firestore.
Users can remove items from the cart.
Cart page shows product name, quantity, and total cost.

### Responsive Design
Built with CSS Grid and Flexbox.
Works on mobile, tablet, and desktop.

## Project Structure

```
urban_threads/
├── index.html          Landing page with hero and featured products
├── shop.html           Product listing with category filters
├── login.html          Login and signup page
├── cart.html           Shopping cart and checkout summary
├── css/
│   └── main.css        Responsive dark theme stylesheet
├── js/
│   ├── firebase_config.js   Firebase SDK configuration
│   ├── auth.js              Authentication logic
│   ├── shop.js              Product loading and cart addition
│   ├── cart.js              Cart display and removal logic
│   ├── main.js              Featured products on home page
│   └── seed.js              One time script to populate products
└── README.md
```

## Setup Instructions

### Step 1: Firebase Project
1. Go to firebase.google.com and create a project named UrbanThreadsStore
2. Enable Authentication with Email/Password provider
3. Enable Firestore Database in test mode
4. Register a web app and copy your firebaseConfig

### Step 2: Configure Code
1. Open js/firebase_config.js
2. Replace the placeholder values with your actual Firebase config

### Step 3: Seed Products
1. Open index.html in your browser
2. Open the browser console (F12)
3. Copy the contents of js/seed.js and paste into the console
4. Press Enter to add the 8 products to Firestore
5. You only need to do this once

### Step 4: Test Locally
Open index.html in your browser and test all features:
- Sign up a new account
- Browse products and filter by category
- Add items to cart
- View cart and remove items
- Log out and verify cart is protected

### Step 5: Deploy to Netlify
1. Create a GitHub repository named urban_threads
2. Push all files to the main branch
3. Go to netlify.com and click Add New Site then Import from Git
4. Select your repository and click Deploy

### Step 6: Update Firestore Rules
Before going live, update your Firestore rules in the Firebase Console:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{product} {
      allow read: if true;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Technologies Used
- HTML5
- CSS3 (Grid, Flexbox, responsive design)
- JavaScript (ES6)
- Firebase Authentication
- Firebase Firestore

## Video Walkthrough
[Loom video link will go here]

## Notes
This project was built as an assignment for the iHub Africa Full Stack Web Development Programme.
The checkout feature is a placeholder for future implementation with Stripe or Paystack.