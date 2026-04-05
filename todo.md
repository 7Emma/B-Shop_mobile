# B-Shop Project TODO

## Phase 1: Core Setup & Branding
- [ ] Generate custom app logo and update app.config.ts
- [ ] Configure app name, colors, and theme in tailwind.config.js
- [ ] Set up project structure and file organization

## Phase 2: Authentication (Login/Sign Up)
- [ ] Create Login screen with email/password form
- [ ] Create Sign Up screen with registration form
- [ ] Implement OAuth integration with Manus
- [ ] Add form validation and error handling
- [ ] Implement secure token storage (SecureStore for native, cookies for web)
- [ ] Create protected routes and auth state management
- [ ] Add logout functionality

## Phase 3: Product Catalog & Home Screen
- [ ] Design and implement Home screen with featured products carousel
- [ ] Create Product Catalog screen with grid layout
- [ ] Implement product search functionality
- [ ] Add product filtering (category, price, rating)
- [ ] Create Product Detail screen with image gallery
- [ ] Implement infinite scroll for product list
- [ ] Set up database schema for products and categories
- [ ] Create tRPC endpoints for product data

## Phase 4: Shopping Cart
- [ ] Create Cart screen UI
- [ ] Implement add to cart functionality
- [ ] Add quantity controls (+/- buttons)
- [ ] Implement remove from cart
- [ ] Calculate subtotal and taxes
- [ ] Persist cart data (AsyncStorage)
- [ ] Add cart badge to tab bar

## Phase 5: Checkout & Payment
- [ ] Create Checkout screen with address selection
- [ ] Add shipping method selection
- [ ] Implement payment method selection (card, Apple Pay, Google Pay)
- [ ] Integrate Stripe payment processing
- [ ] Create Order Confirmation screen
- [ ] Add order number and estimated delivery display
- [ ] Implement order creation in database

## Phase 6: User Profile & Order History
- [ ] Create Profile screen with user info display
- [ ] Implement user profile editing
- [ ] Create Order History screen
- [ ] Add order detail view with status tracking
- [ ] Implement saved addresses management
- [ ] Add settings screen (theme, notifications, language)
- [ ] Implement logout functionality

## Phase 7: Push Notifications
- [ ] Set up Expo Notifications
- [ ] Configure notification permissions
- [ ] Implement local notifications for testing
- [ ] Create push notification handler
- [ ] Add notification routing to relevant screens
- [ ] Display notification badge on tab bar

## Phase 8: Camera Integration
- [ ] Implement camera access permission
- [ ] Create camera capture functionality
- [ ] Add photo picker from device library
- [ ] Integrate image upload to S3 storage
- [ ] Add camera button to Product Detail screen
- [ ] Implement photo preview and confirmation

## Phase 9: Advanced Features
- [ ] Add product reviews and ratings
- [ ] Implement wishlist/favorites
- [ ] Add product recommendations
- [ ] Create promotional banners
- [ ] Implement coupon/discount codes
- [ ] Add user notifications preferences

## Phase 10: Polish & Testing
- [ ] Add loading states and skeleton loaders
- [ ] Implement error handling and user feedback
- [ ] Add animations and transitions
- [ ] Optimize performance (lazy loading, code splitting)
- [ ] Test on iOS and Android devices
- [ ] Conduct end-to-end user flow testing
- [ ] Fix bugs and edge cases
- [ ] Create checkpoint for first delivery

## Phase 11: Deployment Preparation
- [ ] Generate APK for Android
- [ ] Prepare iOS build
- [ ] Create app store listings
- [ ] Set up analytics and crash reporting
- [ ] Document deployment process

## Known Issues & Bugs
(To be updated as development progresses)

## Notes
- Using Expo 54 + React Native 0.81
- Backend: tRPC + MySQL (Drizzle ORM)
- Authentication: Manus OAuth
- Styling: NativeWind (Tailwind CSS)
- State Management: React Context + AsyncStorage
- API: TanStack Query for server data
