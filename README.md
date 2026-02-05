# 💼 HireLink - Job Application & Recruitment Dashboard

A comprehensive React application enabling candidates to apply for jobs and recruiters to manage the hiring pipeline using a Kanban-style dashboard.

## 🚀 Setup Instructions

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
3.  **Open in Browser:**
    Navigate to `http://localhost:5173`

## 🛠 Tech Stack

* **Framework:** React + TypeScript (Vite)
* **UI Library:** Material UI (MUI) v5
* **State Management:** Zustand (with LocalStorage persistence)
* **Routing:** React Router DOM
* **Forms:** React Hook Form + Regex Validation

## 🧠 Key Decisions & Architecture

### 1. Feature-Based Folder Structure
Instead of grouping files by type (e.g., `components/`, `hooks/`), I used a **Feature-Based Architecture**.
* **Why?** It keeps related logic together (`features/recruiter`, `features/candidate`). This makes the codebase easier to scale and maintain. If we delete the "Recruiter" feature, we just delete one folder.

### 2. State Management (Zustand)
I chose **Zustand** over Redux or Context API.
* **Why?** It provides a global store with minimal boilerplate. It handles the application state (applications, reviews, status updates) and automatically syncs with `localStorage` to simulate a database persistence without a backend.

### 3. Material UI (MUI)
* **Why?** To ensure a professional, accessible, and responsive design within the time constraints. It allowed for rapid development of complex UI elements like the Stepper, Modals, and Data Grids.

### 4. Single Source of Truth for Data
* **Decision:** Created a shared `mockJobs.ts` file.
* **Why?** This ensures both the Candidate Job Board and the Recruiter Dashboard reference the exact same Job IDs and Titles, preventing data inconsistencies in the UI.

## ✨ Features

### 👨‍💻 Candidate View
* **Job Board:** Browse job listings with dynamic details.
* **Multi-Step Application Wizard:**
    * **Step 1:** Personal Info (with Email/Phone validation).
    * **Step 2:** Experience & Skills (Autocomplete & File Upload simulation).
    * **Step 3:** Final Review before submission.
* **Real-time Validation:** Prevents submission of invalid data using Regex patterns.

### 👩‍💼 Recruiter View (`/admin`)
* **Kanban Pipeline:** Visual overview of candidates (Applied -> Reviewed -> Interview -> Offer -> Rejected).
* **Detailed Review Modal:**
    * **Mock Resume Viewer:** Visualizes candidate data as a document.
    * **Rating System:** 1-5 Star rating with internal notes.
    * **Scheduling:** Set interview dates with a custom date picker.
* **Dynamic Offer Generator:** Auto-generates an offer letter text based on the selected candidate, salary, and start date.

## 📝 Assumptions
* **Persistence:** Data is saved to `localStorage`, so your changes persist after a refresh. To reset the app, simply clear your browser's local storage.
* **Authentication:** Skipped for this demo. Both views are accessible via the top navigation bar for easy testing.
* **File Upload:** Files are simulated (metadata is stored) rather than uploaded to a physical server.