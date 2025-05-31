import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { GlobalStyles } from '@mui/material';
import theme from './theme';

import Navbar from "./components/Common/Navbar";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/Auth/LoginPage";
import RegisterPage from "./components/Auth/RegisterPage";
import ForgotPasswordPage from "./components/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./components/Auth/ResetPasswordPage";
import ProfilePage from "./components/ProfilePage";
import CoursesList from "./components/Courses/CoursesList";
import MyCourses from "./components/Courses/MyCourses";
import ResultsPage from "./components/Results/ResultsPage";
import EnrolledStudents from "./components/Instructor/EnrolledStudents";
import CourseCreate from "./components/Courses/CourseCreate";
import CourseDetail from "./components/Courses/CourseDetail";
import AssessmentCreate from "./components/Assessments/AssessmentCreate";
import AssessmentDetail from "./components/Assessments/AssessmentDetail";
import StudentAssessments from "./components/Assessments/StudentAssessments";
import CourseEdit from "./components/Courses/CourseEdit";

function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isTokenValid());

  const handleLogin = () => setIsLoggedIn(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location = "/login";
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '*::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '*::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': {
              background: '#555',
            },
          },
          body: {
            overflowX: 'hidden',
          },
        }}
      />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '300px',
            background: 'linear-gradient(180deg, rgba(0,137,123,0.08) 0%, rgba(0,137,123,0) 100%)',
            zIndex: 0,
          },
        }}
      >
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Container 
          maxWidth="lg" 
          sx={{ 
            flex: 1, 
            py: 4,
            position: 'relative',
            zIndex: 1,
            '& > *': {
              borderRadius: theme.shape.borderRadius,
              backdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
            }
          }}
        >
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route
              path="/login"
              element={!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Dashboard />}
            />
            <Route
              path="/register"
              element={!isLoggedIn ? <RegisterPage /> : <Dashboard />}
            />
            <Route
              path="/forgot-password"
              element={!isLoggedIn ? <ForgotPasswordPage /> : <Dashboard />}
            />
            <Route
              path="/reset-password"
              element={!isLoggedIn ? <ResetPasswordPage /> : <Dashboard />}
            />

            {/* PROTECTED ROUTES */}
            <Route
              path="/"
              element={isLoggedIn ? <Dashboard /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/profile"
              element={isLoggedIn ? <ProfilePage /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/courses"
              element={isLoggedIn ? <CoursesList /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/courses/create"
              element={isLoggedIn ? <CourseCreate /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/courses/:id"
              element={isLoggedIn ? <CourseDetail /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/courses/:courseId/edit"
              element={isLoggedIn ? <CourseEdit /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/assessments"
              element={isLoggedIn ? <StudentAssessments /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/assessments/:assessmentId"
              element={isLoggedIn ? <AssessmentDetail /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/courses/:courseId/assessments/create"
              element={isLoggedIn ? <AssessmentCreate /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/courses/:courseId/assessments/:assessmentId"
              element={isLoggedIn ? <AssessmentDetail /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/my-courses"
              element={isLoggedIn ? <MyCourses /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/results"
              element={isLoggedIn ? <ResultsPage /> : <LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/enrolled-students"
              element={isLoggedIn ? <EnrolledStudents /> : <LoginPage onLogin={handleLogin} />}
            />
          </Routes>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
