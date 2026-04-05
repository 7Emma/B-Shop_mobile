# B-Shop Mobile App - Design Plan

## Overview

B-Shop est une application mobile de boutique en ligne native (iOS/Android) avec un catalogue de produits, panier d'achat, authentification utilisateur, notifications, appareil photo et intégration de paiement.

**Orientation** : Portrait (9:16)  
**Design Principle** : iOS-first, one-handed usage, clean and minimal  
**Target Users** : Acheteurs en ligne cherchant une expérience fluide et rapide

---

## Screen List

| Screen | Purpose | Key Content |
|--------|---------|-------------|
| **Splash** | App launch | Logo B-Shop, loading animation |
| **Login** | User authentication | Email/password fields, OAuth option, sign-up link |
| **Sign Up** | User registration | Name, email, password, confirm password |
| **Home** | Main feed | Product carousel, featured items, search bar |
| **Product Catalog** | Browse products | Grid/list of products with filters, search |
| **Product Detail** | Product information | Image gallery, description, price, reviews, add to cart button, camera button (for product photos) |
| **Cart** | Shopping cart | List of items, quantity controls, subtotal, checkout button |
| **Checkout** | Order confirmation | Shipping address, payment method selection, order summary |
| **Payment** | Payment processing | Stripe integration, card details, confirmation |
| **Order Confirmation** | Success screen | Order number, estimated delivery, continue shopping button |
| **Profile** | User account | User info, order history, saved addresses, settings, logout |
| **Order History** | Past orders | List of previous orders with status and details |
| **Notifications** | Push notifications | Order updates, promotions, new products |
| **Settings** | App settings | Theme (light/dark), notification preferences, language |

---

## Primary Content and Functionality

### Home Screen
- **Search Bar** : Recherche rapide de produits
- **Featured Products Carousel** : Produits en vedette avec images
- **Categories** : Navigation par catégorie
- **Recent Items** : Produits récemment consultés
- **Promotions Banner** : Offres spéciales

### Product Catalog
- **Grid Layout** : 2 colonnes de produits
- **Filters** : Par catégorie, prix, note
- **Sort Options** : Prix, popularité, nouveauté
- **Infinite Scroll** : Chargement automatique des produits

### Product Detail
- **Image Gallery** : Swipe entre plusieurs images
- **Product Info** : Nom, prix, description, évaluations
- **Quantity Selector** : Bouton +/- pour quantité
- **Add to Cart Button** : Ajouter au panier
- **Camera Button** : Prendre une photo du produit (optionnel)
- **Reviews Section** : Avis des utilisateurs

### Cart
- **Item List** : Chaque article avec image, prix, quantité
- **Quantity Controls** : +/- pour chaque article
- **Remove Item** : Supprimer du panier
- **Subtotal & Taxes** : Calcul automatique
- **Checkout Button** : Procéder au paiement

### Checkout
- **Shipping Address** : Sélectionner/ajouter adresse
- **Shipping Method** : Options de livraison
- **Payment Method** : Carte de crédit, Apple Pay, Google Pay
- **Order Summary** : Récapitulatif complet
- **Place Order Button** : Confirmer la commande

### Profile
- **User Info** : Nom, email, photo de profil
- **Order History** : Liste des commandes passées
- **Saved Addresses** : Adresses de livraison enregistrées
- **Settings** : Préférences de l'app
- **Logout Button** : Déconnexion

---

## Key User Flows

### Flow 1: Browse & Purchase
1. User opens app → Home screen
2. Tap search or browse categories → Catalog screen
3. Tap product → Product Detail screen
4. Adjust quantity, tap "Add to Cart"
5. Tap cart icon → Cart screen
6. Tap "Checkout" → Checkout screen
7. Enter/select shipping address → Payment screen
8. Enter card details, tap "Pay" → Order Confirmation screen
9. Tap "Continue Shopping" → Home screen

### Flow 2: User Authentication
1. App opens → Check if logged in
2. If not → Login screen
3. Enter email/password or use OAuth
4. Authenticate → Redirect to Home
5. User data stored securely (AsyncStorage + SecureStore)

### Flow 3: Notifications
1. User receives push notification (order update, promotion)
2. Tap notification → Relevant screen (Order History, Product Detail, etc.)
3. Notification badge on tab bar shows count

### Flow 4: Camera Integration
1. User on Product Detail screen
2. Tap camera icon → Open device camera
3. Take photo of product
4. Save/upload photo to profile or product review

### Flow 5: Order History
1. User taps Profile tab
2. Tap "Order History"
3. View list of past orders
4. Tap order → Order details (items, status, tracking)

---

## Color Choices

**Primary Brand Colors:**
- **Primary** : `#0a7ea4` (Teal blue - professional, modern)
- **Secondary** : `#ff6b35` (Warm orange - accent for CTAs)
- **Success** : `#22C55E` (Green - order confirmed, in stock)
- **Warning** : `#F59E0B` (Amber - low stock, alerts)
- **Error** : `#EF4444` (Red - out of stock, errors)

**Neutral Colors:**
- **Background** : `#ffffff` (Light) / `#151718` (Dark)
- **Surface** : `#f5f5f5` (Light) / `#1e2022` (Dark)
- **Foreground** : `#11181C` (Light) / `#ECEDEE` (Dark)
- **Muted** : `#687076` (Light) / `#9BA1A6` (Dark)
- **Border** : `#E5E7EB` (Light) / `#334155` (Dark)

**Typography:**
- **Headings** : Bold, 24-32px
- **Body Text** : Regular, 14-16px
- **Small Text** : Regular, 12-13px

---

## Interaction Patterns

### Button Feedback
- **Primary Buttons** : Scale 0.97 + haptic feedback on press
- **Secondary Buttons** : Opacity 0.7 on press
- **Icons** : Opacity 0.6 on press

### Loading States
- **Skeleton Loaders** : For product lists and images
- **Spinners** : For checkout, payment processing
- **Progress Indicators** : For multi-step checkout

### Empty States
- **No Products** : Illustration + "No results found" message
- **Empty Cart** : Illustration + "Your cart is empty" + "Continue Shopping" button
- **No Orders** : "You haven't placed any orders yet" + "Shop Now" button

### Navigation
- **Tab Bar** : Home, Catalog, Cart, Profile (4 tabs at bottom)
- **Back Button** : Top-left on all screens except Home
- **Deep Links** : Support for notifications and external links

---

## Accessibility

- **Contrast Ratios** : WCAG AA compliant (4.5:1 for text)
- **Touch Targets** : Minimum 44x44 points
- **Font Sizes** : Scalable, respect system settings
- **VoiceOver Support** : All interactive elements labeled

---

## Performance Considerations

- **Image Optimization** : Lazy loading, progressive JPEG
- **List Virtualization** : FlatList for product catalogs
- **Code Splitting** : Lazy load screens via Expo Router
- **Caching** : TanStack Query for API responses

---

## Next Steps

1. Implement authentication (Login/Sign Up screens)
2. Build product catalog with API integration
3. Create cart and checkout flow
4. Integrate Stripe for payments
5. Add push notifications
6. Implement camera functionality
7. Add order history and profile management
8. Polish UI/UX with animations and transitions
