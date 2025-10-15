# Restaurant App

An Expo-managed React Native application that delivers a mobile ordering experience for the Little Lemon restaurant. The app showcases featured dishes, supports category-based menu browsing, and offers quick navigation to ordering and reservation flows.

## Features

- **Home screen** with hero banner, promotional messaging, and category filters.
- **Menu browsing** backed by the local JSON dataset in `Screens/menu/menuitems.json`.
- **Category filtering** that narrows items to Starters, Main Dishes, Salads, Drinks, or Desserts.
- **Order and Reservation navigation** via React Navigation stacks and bottom tabs.
- **Consistent styling** with reusable components and Expo vector icons.

## Tech Stack

- **React Native** (0.81) with **React** 19
- **Expo SDK** 54 for development tooling
- **React Navigation** 7 for routing and navigation stacks
- **Expo Vector Icons** for iconography

## Project Structure

```
resturantapp/
├── App.js                # App entry configuring navigation
├── Screens/              # Screen components
│   ├── HomeScreen.js     # Home view with menu filtering
│   ├── OrderScreen.js
│   ├── ProfileScreen.js
│   ├── OnboardingScreen.js
│   └── SplashScreen.js
├── Screens/menu/
│   └── menuitems.json    # Local menu dataset consumed by HomeScreen
├── assets/               # Images and branding assets
├── package.json          # Dependencies and npm scripts
└── README.md             # Project documentation (this file)
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the Expo development server**
   ```bash
   npm start
   ```
   - Press `i` in the terminal to launch the iOS simulator (macOS).
   - Press `a` to launch the Android emulator.
   - Scan the QR code with the Expo Go app on a physical device.

3. **Update menu data (optional)**
   - Edit `Screens/menu/menuitems.json` to add, remove, or modify dishes.
   - Each item should include `id`, `name`, `description`, `price`, `category`, and `image` fields.

## Available Scripts

- **`npm start`** – Launch the Expo dev server.
- **`npm run android`** – Open the project in an Android emulator via Expo.
- **`npm run ios`** – Open the project in an iOS simulator via Expo (macOS only).
- **`npm run web`** – Run the web build in a browser.

## Troubleshooting

- Ensure you are running Node.js LTS (18+) and npm 9+.
- If the Expo cache misbehaves, clear it with:
  ```bash
  npx expo start -c
  ```
- For menu updates to appear immediately on physical devices, reload the app after editing `menuitems.json`.

## License

This project is for educational and demonstration purposes. Update this section if you plan to distribute the app publicly.
