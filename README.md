# HireLink - Job Application & Recruitment Dashboard

A comprehensive React application enabling candidates to apply for jobs and recruiters to manage the hiring pipeline.

## 🚀 How to Run

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
* **Forms:** React Hook Form

## ✨ Features

### Candidate View
* View available job listings.
* **Multi-Step Application Form:**
    * Step 1: Personal Information (Validation included)
    * Step 2: Experience & Skills
    * Step 3: Review Application before submitting.
* **Success Feedback:** uniquely generated Application ID.

### Recruiter View (`/admin`)
* **Kanban Board:** Visual pipeline of all candidates sorted by status.
* **Review Modal:**
    * View candidate details and "Mock Resume".
    * Rate candidates (1-5 stars) and add internal notes.
    * Schedule Interviews.
    * Move candidates through stages (Interview -> Offer -> Rejected).

## 📝 Assumptions
* Data is persisted using `localStorage` to simulate a backend database.
* Authentication is skipped for simplicity (Recruiter view is accessible via the "Recruiter View" button).