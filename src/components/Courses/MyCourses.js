import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useTheme,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  MenuBook as MenuBookIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    API.get("/courses/enrolled")
      .then(res => setCourses(res.data))
      .catch(() => setCourses([]));
  }, []);

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
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <MenuBookIcon sx={{ fontSize: 40 }} />
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
                My Enrolled Courses
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Track your learning progress
              </Typography>
            </Box>
          </Box>
        </Paper>

        {courses.length === 0 ? (
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            <CardContent
              sx={{
                textAlign: 'center',
                py: 8,
              }}
            >
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: `${theme.palette.primary.main}15`,
                  color: theme.palette.primary.main,
                  margin: '0 auto 24px',
                }}
              >
                <SchoolIcon sx={{ fontSize: 40 }} />
              </Avatar>
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
                No enrolled courses yet
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Browse available courses and enroll to start learning
              </Typography>
            </CardContent>
          </Card>
        ) : (
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
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 30px -10px ${theme.palette.primary.main}20`,
                    },
                  }}
                  onClick={() => navigate(`/courses/${course.courseId}`)}
                >
                  <CardContent 
                    sx={{ 
                      flexGrow: 1,
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
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
