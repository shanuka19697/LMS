# 👨‍🎓 Student Dashboard

The student portal is designed to provide a seamless and focused learning environment. It allows students to manage their academic journey efficiently.

## 🚀 Key Modules

### 🏠 Overview
A bird's-eye view of recent activities, course progress, and upcoming deadlines.

### 🏪 Lesson Store
Students can browse available courses, view details, and enroll. The store features a clean grid layout with filtering options.

### 📖 My Class
Access to all enrolled courses. Each course is organized into modules and lessons for easy navigation.

### 📝 Paper Marks
A dedicated space to view results of assignments and exams. Provides detailed feedback from instructors to help students improve.

### 🔔 Notices
A central hub for all institutional announcements, ensuring students never miss important updates.

### 💳 Payments
Track enrollment fees and payment history. Integrated with secure payment gateways for hassle-free transactions.

### 👤 Profile Management
Update personal information, change passwords, and manage notification preferences.

---

## 🛠️ Implementation Details

- **Route**: `/dashboard`
- **Layout**: `src/app/dashboard/layout.tsx` (Sidebar navigation + Content area)
- **Data Fetching**: Primarily using Supabase client-side and server-side depending on the view.
- **Components**: Utilizes Radix UI for accessible components and Framer Motion for smooth transitions between views.
