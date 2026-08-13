# Urban Threads

Urban Threads is a modern streetwear storefront built with HTML, CSS, JavaScript, Firebase Authentication, and Firestore. The app allows users to browse apparel, save favourites, add products to a personal cart, and complete a checkout experience within a sleek dark-themed storefront.

## Creator
Tefo Karabo Komane
GitHub: https://github.com/TefoKomane

## Live Demo
[Netlify deployment link will go here after publishing]

## Project Overview
This project was built as a storefront prototype for a streetwear brand with a premium, ecommerce-style interface. It focuses on responsive browsing, user authentication, persistent cart data, and a polished shopping experience.

## Features

### Storefront Experience
- Strong black-and-orange brand aesthetic
- Hero section with featured product positioning
- Responsive layout for desktop, tablet, and mobile devices
- Product cards with pricing, category labels, and sale-style badges
- Hover interactions for product imagery and action buttons

### Product Catalogue
- Products are loaded dynamically from Firestore
- Product categories include hoodies, t-shirts, sneakers, and accessories
- Search functionality for products by name
- Sorting options for featured, price, and name ordering
- Category filters for fast browsing
- Product detail pages with additional product information

### User Authentication
- Email and password sign up
- Email and password login
- Secure logout flow
- Logged-in user profile dropdown in the navigation
- Profile area shows the user name and email, plus logout action
- Login page and signup page toggle between forms

### Cart and Checkout
- Users can add products to a cart tied to their Firebase user account
- Cart totals update dynamically based on selected quantity
- Cart page shows item name, price, quantity, and total cost
- Remove item buttons and quantity adjustments are included
- Checkout flow shows an order summary and creates an order in Firestore
- Cart badge count updates to reflect the number of items in the cart

### Wishlist and Promotions
- Wishlist toggle buttons for products
- Product badges for featured items or new drops
- Mobile-friendly nav and action layout
- Loading spinner for product and content loading states

### UX Enhancements
- Toast notifications for user feedback
- Responsive mobile menu with a hamburger toggle
- Hover dropdown menus for the profile area
- Product image zoom on hover for a more premium feel
- Currency conversion from USD to ZAR using 1 USD = 16.18 ZAR

## Tech Stack
- HTML5
- CSS3
- JavaScript (vanilla ES6)
- Firebase Authentication
- Cloud Firestore
- Responsive, component-style UI design

## Project Structure

```text
urban_threads/
├── index.html
├── shop.html
├── login.html
├── cart.html
├── checkout.html
├── product.html
├── README.md
├── css/
│   └── main.css
├── js/
│   ├── auth.js
│   ├── cart.js
│   ├── checkout.js
│   ├── firebase_config.js
│   ├── main.js
│   ├── product.js
│   ├── seed.js
│   └── shop.js
└── assets/
    └── (if images or branding are added later)
```

## Setup Instructions

### 1. Create and configure Firebase
1. Go to Firebase and create a new project.
2. Enable Email/Password authentication.
3. Enable Firestore Database.
4. Register a web app and copy the Firebase configuration values.

### 2. Update your Firebase config
Open the file [js/firebase_config.js](js/firebase_config.js) and replace the placeholder values with your project credentials.

### 3. Seed the product catalog
1. Open the app locally in a browser.
2. Open the browser console.
3. Paste the contents of [js/seed.js](js/seed.js) into the console.
4. Run it once to populate the Firestore product collection.

### 4. Run the app locally
Open the site in your browser and test the main flows:
- create an account
- sign in
- browse products
- filter and sort products
- add items to cart
- update cart quantities
- checkout
- log out

## Firestore Rules
For a basic secure setup, use rules similar to the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
    }

    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /users/{userId}/cart/{cartItem} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /users/{userId}/wishlist/{wishlistItem} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Deployment
1. Push the project to GitHub.
2. Import the repository in Netlify.
3. Deploy the project as a static site.
4. Confirm Firebase configuration is valid in the live environment.

## Notes
- Pricing is currently converted to South African Rand (ZAR) using a rate of 1 USD = 16.18 ZAR.
- This project is a polished storefront prototype and can be extended with real payments, admin product management, reviews, and order history.
- The app is intentionally lightweight and designed to run as a simple static frontend backed by Firebase services.