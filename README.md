<div align="center">

  <h1>Shareek</h1>
  <p><b>Connecting project owners with contributors to build impactful software projects.</b></p>

  <p>
    <a href="#-about-the-project">About</a> •
    <a href="#-key-features">Key Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-project-structure">Project Structure</a> •
    <a href="#-license">License</a>
  </p>

</div>

---

## 📌 About The Project

**Shareek** is a mobile application designed to bridge the gap between project owners and talented software contributors. Whether for academic purposes, training, or production-ready products, Shareek simplifies team formation, project tracking, and open collaboration in a unified platform.

---

## ✨ Key Features

### 🔐 Authentication & Security

* **Complete Auth Flow:** Sign up, sign in, email verification, forgot password, and reset password.
* **Secure Sessions:** Tokens are stored in secure storage, with centralized API error handling and a shared Axios instance.
* **Validated Forms:** Schema-based validation for authentication forms.

### 🎓 Onboarding & Profile Setup

* **Guided Onboarding:** Intro screens along with Privacy Policy and Terms of Service.
* **Multi-Step Profile Setup:** A step-by-step wizard to complete your profile after signing up, including university, skills, and preferred roles.
* **Rich User Profiles:** Edit your profile, add extra info, and browse other developers' profiles.

### 🔍 Discover & Explore

* **Home Feed & Explore:** Browse academic, training, and production projects through dedicated Home and Explore tabs.
* **Project Cards:** Quick, scannable cards showing key project details.
* **Skills & Roles Matching:** Projects and users are organized around roles and skills to help find the right fit.

### 🛠 Project Creation & Management

* **3-Step Project Wizard:** Create a project step by step, with a success confirmation at the end.
* **Drafts:** Save unfinished projects as drafts and come back to them later.
* **Project Lifecycle States:** Dedicated views for Draft, Active, Completed, and Blocked projects.
* **My Projects:** Track every project you own or take part in from one place.
* **Completion Requests:** Request project completion and confirm it through a dedicated flow.

### 👥 Team & Collaboration

* **Role-Based Teams:** Define the roles you need and the required team size for each project.
* **Apply to Join:** Contributors can apply to a specific role, with a confirmation after submitting.
* **Applicant Review:** Owners review applicants and accept or reject them.
* **Team Management:** Manage team members and roles after the project starts.
* **My Requests:** Follow the status of every request you've sent.
* **Chat:** A dedicated chat tab for communication between team members.

### ⭐️ Save, Share & Engage

* **Star & Save:** Show appreciation for outstanding projects and save your favorites for quick access.
* **Saved Projects:** A dedicated saved list, persisted locally on your device.
* **Seamless Sharing:** Share project links across social media platforms.

### 🔔 Notifications

* **In-App Notification Center:** View all your notifications in one place.

### 🛡 Moderation & Safety

* **Block Users:** Block unwanted users and manage the blocked list.
* **Blocked Projects:** Moderated projects are handled with a dedicated view.
* **Settings:** Manage account and app preferences from the side menu.

---

## 🛠 Tech Stack

| Domain | Technologies Used |
| :--- | :--- |
| **Framework** | [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native) |
| **State & Navigation** | [Expo Router](https://docs.expo.dev/router/introduction/) & Zustand / React Hooks |
| **Storage & API** | [Axios](https://axios-http.com/) & [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm installed on your machine:

* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)
* **Expo Go** app installed on your physical device (iOS/Android), or an emulator ready.

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/zeinalakhras/shareek.git
   cd shareek
   ```

2. **Install NPM packages:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```env
   EXPO_PUBLIC_API_URL
   ```

4. **Start the development server:**

   ```bash
   npx expo start
   ```

5. **Run the app:** scan the QR code with Expo Go, or press `a` (Android emulator) / `i` (iOS simulator).

---

## 📂 Project Structure

```text
📁 shareek/
├── 📁 api/
│   ├── 📁 application/
│   │   ├── 📄 applicationApi.ts
│   │   └── 📄 types.ts
│   ├── 📁 auth/
│   │   ├── 📄 authApi.ts
│   │   └── 📄 types.ts
│   ├── 📁 moderation/
│   │   ├── 📄 moderationApi.ts
│   │   └── 📄 types.ts
│   ├── 📁 notification/
│   │   ├── 📄 devicesApi.ts
│   │   ├── 📄 notificationApi.ts
│   │   └── 📄 types.ts
│   ├── 📁 project/
│   │   ├── 📄 projectApi.ts
│   │   ├── 📄 projectRequestApi.ts
│   │   ├── 📄 projectRole.ts
│   │   └── 📄 types.ts
│   ├── 📁 role/
│   │   ├── 📄 roleApi.ts
│   │   └── 📄 types.ts
│   ├── 📁 skill/
│   │   ├── 📄 skillApi.ts
│   │   └── 📄 types.ts
│   ├── 📁 university/
│   │   ├── 📄 universityApi.ts
│   │   └── 📄 types.ts
│   ├── 📁 user/
│   │   ├── 📄 userApi.ts
│   │   └── 📄 types.ts
│   └── 📄 axiosInstance.ts
├── 📁 app/
│   ├── 📁 (auth)/
│   │   ├── 📄 email-verification.tsx
│   │   ├── 📄 forget-password.tsx
│   │   ├── 📄 reset-password.tsx
│   │   ├── 📄 sign-in.tsx
│   │   ├── 📄 sign-up.tsx
│   │   └── 📄 _layout.tsx
│   ├── 📁 (menu)/
│   │   ├── 📄 blocked-users.tsx
│   │   ├── 📄 drafts.tsx
│   │   ├── 📄 my-projects.tsx
│   │   ├── 📄 my-requests.tsx
│   │   ├── 📄 notifications.tsx
│   │   ├── 📄 saved.tsx
│   │   ├── 📄 settings.tsx
│   │   └── 📄 _layout.tsx
│   ├── 📁 (onboarding)/
│   │   ├── 📄 first.tsx
│   │   ├── 📄 privacy-policy.tsx
│   │   ├── 📄 second.tsx
│   │   ├── 📄 terms-of-service.tsx
│   │   ├── 📄 third.tsx
│   │   └── 📄 _layout.tsx
│   ├── 📁 (setup)/
│   │   ├── 📄 step2.tsx
│   │   ├── 📄 step3.tsx
│   │   ├── 📄 step4.tsx
│   │   ├── 📄 step5.tsx
│   │   ├── 📄 success.tsx
│   │   └── 📄 _layout.tsx
│   ├── 📁 (tabs)/
│   │   ├── 📄 chat.tsx
│   │   ├── 📄 create.tsx
│   │   ├── 📄 explore.tsx
│   │   ├── 📄 home.tsx
│   │   ├── 📄 profile.tsx
│   │   └── 📄 _layout.tsx
│   ├── 📁 create/
│   │   ├── 📄 create-step1.tsx
│   │   ├── 📄 create-step2.tsx
│   │   ├── 📄 create-step3.tsx
│   │   ├── 📄 success.tsx
│   │   └── 📄 _layout.tsx
│   ├── 📁 profile/
│   │   ├── 📄 additional-info.tsx
│   │   ├── 📄 edit-profile.tsx
│   │   └── 📄 _layout.tsx
│   ├── 📁 projects/
│   │   └── 📁 [id]/
│   │       ├── 📄 apply.tsx
│   │       ├── 📄 index.tsx
│   │       ├── 📄 manage-team.tsx
│   │       ├── 📄 request-completion.tsx
│   │       └── 📄 _layout.tsx
│   ├── 📁 users/
│   │   ├── 📄 about.tsx
│   │   └── 📄 index.tsx
│   ├── 📄 _layout.tsx
│   └── 📄 index.tsx
├── 📁 assets/
├── 📁 components/
│   ├── 📁 project-details/
│   │   ├── 📄 ActiveProjectView.tsx
│   │   ├── 📄 ApplicantModal.tsx
│   │   ├── 📄 ApplicationSuccessModal.tsx
│   │   ├── 📄 ApplyToJoinView.tsx
│   │   ├── 📄 BlockedProjectView.tsx
│   │   ├── 📄 CompletedProjectView.tsx
│   │   ├── 📄 DraftProjectVeiw.tsx
│   │   ├── 📄 ManageTeamView.tsx
│   │   └── 📄 ProjectCompletedModal.tsx
│   ├── 📄 AddRoleModal.tsx
│   ├── 📄 CustomButton.tsx
│   ├── 📄 ExploreProjectsCard.tsx
│   ├── 📄 FormField.tsx
│   ├── 📄 ProgressBar.tsx
│   ├── 📄 ProjectCard.tsx
│   ├── 📄 SavedCard.tsx
│   ├── 📄 sideMenu.tsx
│   ├── 📄 SimpleProgressBar.tsx
│   └── 📄 TeamCard.tsx
├── 📁 hooks/
│   ├── 📄 useAuth.ts
│   └── 📄 useSavedProject.ts
├── 📁 schemas/
│   └── 📄 authSchema.ts
├── 📁 store/
│   ├── 📄 useAuthStore.ts
│   └── 📄 useSignUpStore.ts
├── 📁 types/
│   ├── 📄 project.ts
│   ├── 📄 types.ts
│   └── 📄 user.ts
└── 📁 utils/
    ├── 📄 apiError.ts
    ├── 📄 projectUtils.ts
    ├── 📄 savedProjects.ts
    └── 📄 secureStore.ts
```
## 📄 License

Distributed under the MIT License. See the [LICENSE](LICENSE) file for more information.