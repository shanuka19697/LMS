# 👩‍💼 Admin Management Panel

The Administrative Control Center is the powerhouse of the LMS, enabling staff to manage all aspects of the educational platform.

## 🛠️ Administrative Modules

### 📚 Course & Lesson Management
- **Lessons**: Create and edit lesson content, including video uploads via Cloudinary.
- **Papers**: Design and distribute exam papers or assignments.
- **Exam Years**: Organize curriculum by academic years.

### 👥 User Management
- **Students**: Monitor all registered students, their enrollment status, and overall performance.
- **Admins**: Manage staff accounts and permissions.

### 📈 Business Intelligence
- **Sales**: Real-time tracking of revenue generated from course enrollments.
- **Performance**: High-level analytics on student engagement and completion rates.

### 🎥 Live Class Integration
- **Zoom**: Direct integration to schedule, update, and manage live online classes.

### ✉️ Communication Suite
- **Messages**: Direct communication channel with students and other admins.
- **Notices**: Publish and manage platform-wide announcements.
- **Notifications**: Send automated or manual push notifications to users.

---

## 🛠️ Implementation Details

- **Route**: `/admin`
- **Security**: Protected via middleware to ensure only authorized personnel can access these routes.
- **Layout**: `src/app/admin/layout.tsx` (Admin-specific sidebar and top-bar navigation)
- **State Management**: Heavy use of Server Actions (`src/actions`) for handling complex data mutations.
- **Media**: Integrated with Cloudinary for robust video and image hosting.
