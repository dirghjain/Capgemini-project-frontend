import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Alert,
  Snackbar,
  useTheme,
  Paper,
  Tooltip,
  Avatar,
  Chip,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  Assignment as AssignmentIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const role = getUserRole();
  const theme = useTheme();

  useEffect(() => {
    API.get("/courses")
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));

    if (role === "Student") {
      API.get("/courses/enrolled")
        .then(res => setEnrolledCourses(res.data))
        .catch(() => setEnrolledCourses([]));
    }
  }, [role]);

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingCourseId(courseId);
      await API.post(`/courses/${courseId}/enroll`);
      const enrolledCourse = courses.find(c => c.courseId === courseId);
      setEnrolledCourses(prev => [...prev, enrolledCourse]);
      setMsg("Successfully enrolled in the course!");
    } catch (error) {
      setMsg("Failed to enroll in the course. Please try again.");
    } finally {
      setEnrollingCourseId(null);
    }
  };

  // Delete course
  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`/courses/${courseId}`);
      setCourses(courses.filter(c => c.courseId !== courseId));
      setMsg("Course deleted successfully");
    } catch {
      setMsg("Failed to delete course");
    }
  };

  const handleCloseMsg = () => setMsg("");

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(course => course.courseId === courseId || course === courseId);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
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
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <SchoolIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  Available Courses
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  {role === "Instructor" ? "Manage your courses" : "Explore and enroll in courses"}
                </Typography>
              </Box>
            </Box>
            {role === "Instructor" && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/courses/create")}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 20px -4px ${theme.palette.primary.main}40`,
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Create Course
              </Button>
            )}
          </Box>
        </Paper>

        <Grid container spacing={3}>
          {courses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course.courseId}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 20px 30px -10px ${theme.palette.primary.main}20`,
                  },
                }}
              >
                <CardContent 
                  sx={{ 
                    flexGrow: 1, 
                    cursor: role === "Instructor" ? 'pointer' : 'default',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}08)`,
                      borderRadius: 'inherit',
                    },
                  }} 
                  onClick={(e) => {
                    if (role === "Instructor") {
                      navigate(`/courses/${course.courseId}`);
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: `${theme.palette.primary.main}15`,
                          color: theme.palette.primary.main,
                          width: 48,
                          height: 48,
                          mr: 2,
                        }}
                      >
                        <SchoolIcon />
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="h6" 
                          component="h2"
                          sx={{
                            fontWeight: 600,
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}
                        >
                          {course.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip
                            size="small"
                            icon={<PersonIcon sx={{ fontSize: '1rem !important' }} />}
                            label={course.instructor || 'Instructor'}
                            sx={{ 
                              bgcolor: 'rgba(0, 0, 0, 0.05)',
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    {course.description && (
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.6,
                        }}
                      >
                        {course.description}
                      </Typography>
                    )}

                    {role === "Student" && (
                      <Button
                        variant={isEnrolled(course.courseId) ? "outlined" : "contained"}
                        fullWidth
                        disabled={enrollingCourseId === course.courseId}
                        startIcon={isEnrolled(course.courseId) ? <CheckIcon /> : null}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isEnrolled(course.courseId)) {
                            handleEnroll(course.courseId);
                          }
                        }}
                        sx={{
                          mt: 2,
                          background: isEnrolled(course.courseId) 
                            ? 'transparent'
                            : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          color: isEnrolled(course.courseId) ? theme.palette.success.main : 'white',
                          borderColor: isEnrolled(course.courseId) ? theme.palette.success.main : 'transparent',
                          '&:hover': {
                            transform: isEnrolled(course.courseId) ? 'none' : 'translateY(-2px)',
                            boxShadow: isEnrolled(course.courseId) 
                              ? 'none' 
                              : `0 8px 20px -4px ${theme.palette.primary.main}40`,
                            borderColor: isEnrolled(course.courseId) ? theme.palette.success.main : 'transparent',
                            background: isEnrolled(course.courseId) 
                              ? 'transparent'
                              : `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          },
                        }}
                      >
                        {enrollingCourseId === course.courseId ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          isEnrolled(course.courseId) ? 'Enrolled' : 'Enroll Now'
                        )}
                      </Button>
                    )}

                    {role === "Instructor" && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Course Progress
                          </Typography>
                          <Typography 
                            variant="caption" 
                            sx={{
                              color: theme.palette.primary.main,
                              fontWeight: 600,
                            }}
                          >
                            {Math.floor(Math.random() * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={Math.floor(Math.random() * 100)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: `${theme.palette.primary.main}15`,
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            },
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                </CardContent>
                {role === "Instructor" && (
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Tooltip title="Edit Course">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/edit/${course.courseId}`);
                        }}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            bgcolor: `${theme.palette.primary.main}15`,
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Course">
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(course.courseId);
                        }}
                        sx={{
                          color: theme.palette.error.main,
                          '&:hover': {
                            bgcolor: `${theme.palette.error.main}15`,
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.2s',
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {courses.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              py: 8,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <SchoolIcon 
              sx={{ 
                fontSize: 64, 
                mb: 2, 
                color: theme.palette.primary.main,
                opacity: 0.7,
              }} 
            />
            <Typography 
              variant="h5"
              sx={{
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              No Courses Available
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {role === "Instructor" 
                ? "Start creating your first course to begin teaching"
                : "Check back later for new learning opportunities"}
            </Typography>
            {role === "Instructor" && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/courses/create')}
                sx={{
                  mt: 3,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Create Your First Course
              </Button>
            )}
          </Paper>
        )}

        <Snackbar
          open={Boolean(msg)}
          autoHideDuration={6000}
          onClose={handleCloseMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseMsg}
            severity={msg.includes('success') ? 'success' : 'error'}
            sx={{ 
              width: '100%',
              borderRadius: 2,
              bgcolor: msg.includes('success') ? 'success.lighter' : 'error.lighter',
            }}
          >
            {msg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CoursesList;
