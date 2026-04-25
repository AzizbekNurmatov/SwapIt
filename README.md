# SwapIt ♻️

SwapIt is a localized marketplace mobile application built for college students to safely buy, sell, and trade items on campus. 
<img width="258" height="491" alt="Screenshot 2026-04-24 225226" src="https://github.com/user-attachments/assets/aac98f16-ceb2-4197-9df1-dbddcca4ac45" />
<img width="263" height="488" alt="Screenshot 2026-04-24 225729" src="https://github.com/user-attachments/assets/c022e9fb-ea31-42a8-bf98-dbcd80bbbe3b" />
<img width="253" height="491" alt="Screenshot 2026-04-24 225747" src="https://github.com/user-attachments/assets/c01ac6d6-2c82-4bf8-a220-1241c7b68bdd" />
<img width="252" height="490" alt="Screenshot 2026-04-24 225802" src="https://github.com/user-attachments/assets/3ada2c81-2063-4658-9368-c2074da4ecda" />

## ✨ Core Features
This project was developed over 5 weeks and implements the following architecture:
* **Secure Authentication:** Full login/signup flow protected by a global routing bouncer, managed via Supabase Auth.
* **Complex Navigation:** Built with Expo Router utilizing 3 main Tabs, 2 nested Stacks, and dynamic routing for item detail pages (`/listing/[id]`).
* **Interactive Maps:** Integrated map view with dynamic markers representing safe on-campus swap locations.
* **Local Notifications:** Logic-based notifications trigger automatically upon successful creation or interaction with a listing.
* **Data Persistence:** Cloud database integration via Supabase, alongside local storage solutions for offline preference tracking.

## 🛠️ Tech Stack
* **Frontend:** React Native, Expo, Expo Router
* **Backend/Database:** Supabase (PostgreSQL)
* **Authentication:** Supabase Auth

## 🚀 Installation & Setup

To run this project locally, you will need Node.js and the Expo CLI installed.

**1. Clone the repository:**
`git clone https://github.com/AzizbekNurmatov/SwapIt.git`
`cd SwapIt`

**2. Install dependencies:**
`npm install`

**3. Set up Environment Variables:**
This app requires a connection to Supabase to function. You must create a `.env` file in the root directory of the project and add the following keys:

`EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url`
`EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`

**4. Start the app:**
`npx expo start`

Scan the QR code with the Expo Go app on your physical device, or press `i` to open it in the iOS Simulator / `a` for the Android Emulator.

## 👥 Team
* Azizbek Nurmatov - Core Auth Architecture & Routing
* Brett Pressley - UI/UX Polish & Cloud Integration
