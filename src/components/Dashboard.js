import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  useTheme,
  Avatar,
  Paper,
  Container,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  MenuBook as MenuBookIcon,
  Group as GroupIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import API from "../services/api";

const DashboardCard = ({ title, description, icon, onClick, color, progress }) => {
  const theme = useTheme();
  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${theme.palette[color].light}15, ${theme.palette[color].main}15)`,
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: `${theme.palette[color].main}30`,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: `0 20px 30px -10px ${theme.palette[color].main}20`,
          '& .card-icon': {
            transform: 'scale(1.1) rotate(5deg)',
            boxShadow: `0 10px 20px -5px ${theme.palette[color].main}40`,
          },
        }
      }}
    >
      <CardActionArea 
        onClick={onClick}
        sx={{ 
          height: '100%', 
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 2 }}>
          <Avatar
            className="card-icon"
            sx={{
              bgcolor: theme.palette[color].main,
              width: 56,
              height: 56,
              transition: 'all 0.3s ease-in-out',
              boxShadow: `0 8px 16px -4px ${theme.palette[color].main}30`,
            }}
          >
            {icon}
          </Avatar>
          {progress !== undefined && (
            <Box sx={{ ml: 'auto', textAlign: 'right' }}>
              <Typography variant="h6" color={`${color}.main`} sx={{ fontWeight: 600 }}>
                {progress}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Complete
              </Typography>
            </Box>
          )}
        </Box>
        <Typography 
          variant="h6" 
          component="h2" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette[color].main}, ${theme.palette[color].dark})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        {progress !== undefined && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              width: '100%',
              height: 6,
              borderRadius: 3,
              bgcolor: `${theme.palette[color].main}20`,
              '& .MuiLinearProgress-bar': {
                bgcolor: theme.palette[color].main,
              },
            }}
          />
        )}
      </CardActionArea>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (!role) {
      navigate("/login");
    } else {
      setRole(role);
      setName(name);
      setEmail(email);

      if (role === "Student") {
        API.get("/courses/enrolled")
          .then(res => setEnrolledCourses(res.data))
          .catch(console.error);
      }
    }
  }, [navigate]);

  const getStudentDashboardItems = () => [
    {
      title: "Browse Courses",
      description: "Explore and enroll in our comprehensive course catalog",
      icon: <SchoolIcon />,
      path: "/courses",
      color: "primary",
    },
    {
      title: "My Learning Journey",
      description: "Track your progress in enrolled courses",
      icon: <MenuBookIcon />,
      path: "/my-courses",
      color: "secondary",
      progress: 75,
    },
    {
      title: "Upcoming Assessments",
      description: "View and prepare for your scheduled assessments",
      icon: <AssessmentIcon />,
      path: "/assessments",
      color: "success",
      progress: 60,
    },
    {
      title: "Performance Analytics",
      description: "Review your assessment results and progress",
      icon: <TrendingUpIcon />,
      path: "/results",
      color: "info",
      progress: 85,
    },
    {
      title: "My Profile",
      description: "Manage your account settings and preferences",
      icon: <PersonIcon />,
      path: "/profile",
      color: "warning",
    }
  ];

  const getInstructorDashboardItems = () => [
    {
      title: "Course Management",
      description: "Oversee and update your course content",
      icon: <SchoolIcon />,
      path: "/courses",
      color: "primary",
    },
    {
      title: "Create New Course",
      description: "Design and publish a new learning experience",
      icon: <AddIcon />,
      path: "/courses/create",
      color: "secondary",
    },
    {
      title: "Student Performance",
      description: "Monitor assessment results and student progress",
      icon: <TrendingUpIcon />,
      path: "/results",
      color: "success",
    },
    {
      title: "Instructor Profile",
      description: "Update your teaching profile and credentials",
      icon: <PersonIcon />,
      path: "/profile",
      color: "info",
    }
  ];

  const dashboardItems = role === "Student" ? getStudentDashboardItems() : getInstructorDashboardItems();

  return (
    <Box 
      sx={{ 
        minHeight: '100%',
        pt: 4,
        pb: 8,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '5%',
          width: '90%',
          height: '100%',
          background: `radial-gradient(circle at 50% 0%, ${theme.palette.primary.main}15, transparent 70%)`,
          pointerEvents: 'none',
        }
      }}
    >
      <Container maxWidth="lg">
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 6,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 70%)',
            }
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Welcome back, {name}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
              {role} Dashboard
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <DashboardCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                onClick={() => navigate(item.path)}
                color={item.color}
                progress={item.progress}
              />
            </Grid>
          ))}
        </Grid>

        {role === "Student" && enrolledCourses.length > 0 && (
          <Box sx={{ mt: 8 }}>
            <Typography 
              variant="h4" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                mb: 4,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Your Learning Progress
            </Typography>
            <Grid container spacing={3}>
              {enrolledCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <Card
                    sx={{
                      background: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[8],
                      }
                    }}
                  >
                    <CardActionArea onClick={() => navigate(`/courses/${course.id}`)}>
                      <CardContent sx={{ p: 3 }}>
                        <Typography 
                          variant="h6" 
                          component="h2" 
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          {course.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          {course.description}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.floor(Math.random() * 100)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: theme.palette.primary.light + '20',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: theme.palette.primary.main,
                            },
                          }}
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Dashboard;
