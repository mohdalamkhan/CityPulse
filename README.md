# 🏙️ City Pulse - Local Events Explorer

A modern React Native application for discovering and exploring local events using the Ticketmaster Discovery API. Built with TypeScript, Redux Toolkit, Firebase, and featuring a beautiful splash screen with professional branding.

## ✨ Features

- 🔍 **Event Search** - Search events by keyword and city using Ticketmaster API
- 📱 **Event Details** - View event information with images, pricing, and venue details
- ❤️ **Favorites** - Save favorite events with Redux state management
- 🌐 **Multi-language** - English and Arabic support with RTL layout
- 🔐 **Authentication** - Firebase email/password login and registration
- 👤 **User Profile** - Language settings and account management
- 🎨 **Custom Splash Screen** - Professional City Pulse logo and branding
- 🔒 **Biometric Login** - Fingerprint and Face ID support
- 🗺️ **Map Directions** - Get directions to event venues using native maps
<!-- - 🗂️ **Secure Storage** - Encrypted local data storage -->
- 📱 **Cross-platform** - iOS and Android support

## 🏗️ Tech Stack

### Frontend
- **React Native 0.81** - Cross-platform mobile framework
- **TypeScript** - Type-safe development
- **React Navigation 6** - Navigation and routing
- **Redux Toolkit** - State management with slices
- **React Hook Form** - Efficient form handling
- **react-i18next** - Internationalization framework
- **React Native Vector Icons** - Beautiful iconography
- **React Native Bootsplash** - Professional splash screen

### Backend & Services
- **Firebase Authentication** - User login/registration
- **Ticketmaster Discovery API** - Event data source
- **React Native AsyncStorage** - Local data storage
- **React Native Biometrics** - Biometric authentication
- **React Native Bootsplash** - Custom splash screen

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- React Native CLI
- Xcode 14+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS dependencies)

### Installation

**Note:** This project does not use Git version control. Simply download or copy the project files to get started.

1. **Install dependencies**
```bash
npm install
# or
yarn install
```

2. **Install iOS dependencies** (iOS only)
```bash
cd ios && pod install && cd ..
```

### 🔑 Configuration

#### Ticketmaster API (Required)
The app is already configured with a Ticketmaster API key in `src/constants/api.constants.ts`:
```typescript
export const API_CONFIG = {
  TICKETMASTER_API_KEY: '',
  TICKETMASTER_BASE_URL: '',
  // ... other config
};
```

### Note 1: The TICKETMASTER_API_KEY and TICKETMASTER_BASE_URL have been provided via email. Please add these values to the `api.constants.ts` file.

### Note 2: Firebase configuration files need to be added:
- **GoogleService-Info.plist** should be placed in the `ios/CityPulse/` folder
- **google-services.json** should be placed in the `android/app/` folder


#### Firebase Setup (Included)
Firebase configuration files are already included:
- **iOS**: `ios/CityPulse/GoogleService-Info.plist`
- **Android**: `android/app/google-services.json`

The app is pre-configured for Firebase Authentication and Firestore.

### 🏃‍♂️ Running the App

#### Start Metro Bundler
```bash
npm start
# or with cache reset
npm start -- --reset-cache
```

#### iOS
```bash
npm run ios
# or specific simulator
npx react-native run-ios --simulator="iPhone 14"
```

#### Android
```bash
npm run android
# or specific device
npx react-native run-android --deviceId=<device-id>
```

## 📱 Project Structure

```
CityPulse/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # UI components (Button, TextInput, Toast)
│   ├── constants/       # App constants and API config
│   ├── context/         # React Context providers
│   ├── hooks/           # Custom hooks (useAuth, useFavorites, etc.)
│   ├── i18n/           # Internationalization
│   ├── navigation/     # Navigation configuration
│   ├── screens/        # App screens (auth, home, profile, etc.)
│   ├── services/       # API services (ticketmaster, firebase, biometric)
│   ├── storage/        # Local storage utilities
│   ├── store/          # Redux store and slices
│   ├── types/          # TypeScript definitions
│   └── utils/          # Utility functions
├── assets/             # Root assets and splash screen
├── android/            # Android native code
├── ios/                # iOS native code
├── App.tsx             # Root component
├── index.js           # Entry point
└── package.json       # Dependencies
```

### Component Structure Convention
Each screen/component follows this clean structure:
- `index.tsx` - Main component logic
- `styles.ts` - StyleSheet definitions
- `types.ts` - TypeScript interfaces

## 🎯 Key Features

### Event Search & Details
- Search events using Ticketmaster API
- View event details with images and venue information
- Event pricing and date/time information
- **Map Directions** - Get directions to event venues via Apple Maps integration

### User Management
- Firebase email/password authentication
- User profile with language preferences
- Biometric login (fingerprint/Face ID)

### Favorites & Storage
- Add/remove events to favorites
- Redux state management for favorites
- Local storage for app data and settings

### Multi-language Support
- English and Arabic translations
- RTL layout support for Arabic
- Language switching in profile settings

## 🔧 API Integration
```typescript
// Search events
const results = await ticketmasterService.searchEvents({
  keyword: 'concert',
  city: 'New York'
});

// Get event details
const event = await ticketmasterService.getEventDetails(eventId);

// Get directions to venue
const venue = ticketmasterService.getEventVenue(event);
const { latitude, longitude } = venue.location;
const url = `https://maps.apple.com/?daddr=${latitude},${longitude}`;
Linking.openURL(url);
```

### State Management
```typescript
// Favorites management with Redux
const { favorites, addFavorite, removeFavorite } = useFavorites();
```

## 🧪 Development Commands
```bash
# Start Metro bundler
npm start

# Reset cache
npm start -- --reset-cache

# iOS clean build
cd ios && pod install && cd ..

# Android clean build
cd android && ./gradlew clean && cd ..
```

## 📦 Building for Production

### iOS
```bash
# Clean and build
cd ios
pod install
xcodebuild -workspace CityPulse.xcworkspace -scheme CityPulse -configuration Release
```

### Android
```bash
# Build release APK
cd android
./gradlew assembleRelease

# Build App Bundle for Play Store
./gradlew bundleRelease
```

## 🎨 Custom Splash Screen

Professional City Pulse logo with city skyline design, optimized for all device sizes.

## 🛠️ Configuration

### Path Aliases
The project uses **Babel Plugin Module Resolver** for clean import paths:

```typescript
// Instead of relative imports
import Button from '../../../components/Button';

// Use clean aliases
import Button from '@components/Button';
```

**Configured aliases:**
- `@components/*` → `./src/components/*`
- `@screens/*` → `./src/screens/*`
- `@utils/*` → `./src/utils/*`
- `@constants/*` → `./src/constants/*`
- `@services/*` → `./src/services/*`
- `@hooks/*` → `./src/hooks/*`
- `@store/*` → `./src/store/*`
- `@types/*` → `./src/types/*`

Setup includes:
- **babel.config.js** - Babel module resolver configuration
- **tsconfig.json** - TypeScript path mapping
- **metro.config.js** - Metro bundler alias support

Ticketmaster API and Firebase are pre-configured. Constants are organized in `src/constants/` folder.

## 🙏 Acknowledgments

- **Ticketmaster Discovery API** - Providing comprehensive event data
- **Firebase** - Backend infrastructure and real-time capabilities  
- **React Native Community** - Amazing framework and ecosystem
- **React Navigation** - Seamless navigation solution
- **Redux Toolkit** - Efficient state management
# CityPulse
