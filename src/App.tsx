import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";

// Import all pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// User pages
import UserDashboard from "./pages/user/Dashboard";
import UserCertificates from "./pages/user/Certificates";
import UserStudentInfo from "./pages/user/StudentInfo";
import UserCompanyInfo from "./pages/user/CompanyInfo";
import UserDownloads from "./pages/user/Downloads";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCertificates from "./pages/admin/Certificates";
import AdminCourses from "./pages/admin/Courses";
import AdminCompanyInfo from "./pages/admin/CompanyInfo";
import AdminRequests from "./pages/admin/Requests";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Default redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Authentication */}
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } />
            
            {/* User Routes */}
            <Route path="/user" element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path="dashboard" element={<UserDashboard />} />
              <Route path="certificates" element={<UserCertificates />} />
              <Route path="downloads" element={<UserDownloads />} />
              <Route path="student-info" element={<UserStudentInfo />} />
              <Route path="company-info" element={<UserCompanyInfo />} />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="certificates" element={<AdminCertificates />} />
              <Route path="requests" element={<AdminRequests />} />
              <Route path="courses" element={<AdminCourses />} />
              <Route path="company-info" element={<AdminCompanyInfo />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
