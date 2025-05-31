import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Divider,
  Skeleton,
  useTheme,
  Tooltip,
  Snackbar,
  Avatar,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PlayArrow as EnrollIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  Check as CheckIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [msg, setMsg] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const userRole = getUserRole();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, assessmentsRes] = await Promise.all([
          API.get(`/courses/${id}`),
          API.get("/assessments")
        ]);
        
        setCourse(courseRes.data);
        const courseAssessments = assessmentsRes.data.filter(a => a.courseId === id);
        setAssessments(courseAssessments);

        if (userRole === "Student") {
          const enrollmentRes = await API.get(`/courses/${id}/enrollment-status`);
          setEnrolled(enrollmentRes.data.enrolled);
        }
      } catch (error) {
        setMsg("Failed to load course data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, userRole]);

  const handleEnroll = async () => {
    try {
      await API.post(`/courses/${id}/enroll`);
      setEnrolled(true);
      setEnrollMsg("Successfully enrolled in the course!");
    } catch (err) {
      let message = "Failed to enroll.";
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "string") message = data;
        else if (data.title) message = data.title;
        else if (data.errors) message = Object.values(data.errors).flat().join(", ");
      }
      setEnrollMsg(message);
    }
  };

  const handleDelete = async (assessmentId) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await API.delete(`/assessments/${assessmentId}`);
      setAssessments(prev => prev.filter(a => a.assessmentId !== assessmentId));
      setMsg("Assessment deleted successfully");
    } catch (err) {
      setMsg("Failed to delete assessment");
    }
  };

  const handleCloseMsg = () => setMsg("");
  const handleCloseEnrollMsg = () => setEnrollMsg("");

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Skeleton 
            variant="rectangular" 
            height={300} 
            sx={{ 
              mb: 4, 
              borderRadius: 4,
              animation: 'pulse 1.5s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': { opacity: 0.6 },
                '50%': { opacity: 0.8 },
                '100%': { opacity: 0.6 },
              },
            }} 
          />
          <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
              <Grid item xs={12} md={4} key={item}>
                <Skeleton 
                  variant="rectangular" 
                  height={200} 
                  sx={{ 
                    borderRadius: 3,
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${item * 0.2}s`,
                  }} 
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert 
            severity="error"
            sx={{ borderRadius: 2 }}
          >
            Failed to load course
          </Alert>
        </Box>
      </Container>
    );
  }

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
          <Box sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 3 }}>
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
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 700,
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {course.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<PersonIcon />}
                    label={course.instructor || 'Instructor'}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                  <Chip
                    icon={<AccessTimeIcon />}
                    label="8 weeks"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                  <Chip
                    icon={<AssignmentIcon />}
                    label={`${assessments.length} Assessments`}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                    }}
                  />
                </Box>
                {course.description && (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      opacity: 0.9,
                      maxWidth: '800px',
                      lineHeight: 1.6,
                    }}
                  >
                    {course.description}
                  </Typography>
                )}
              </Box>
              {userRole === "Student" && !enrolled && (
                <Button
                  variant="contained"
                  startIcon={<EnrollIcon />}
                  onClick={handleEnroll}
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
                  Enroll Now
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${theme.palette.primary.main}15`,
                      color: theme.palette.primary.main,
                      mr: 2,
                    }}
                  >
                    <DescriptionIcon />
                  </Avatar>
                  <Typography 
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Course Overview
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress
                    </Typography>
                    <Typography 
                      variant="body2" 
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
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${theme.palette.secondary.main}15`,
                      color: theme.palette.secondary.main,
                      mr: 2,
                    }}
                  >
                    <TimerIcon />
                  </Avatar>
                  <Typography 
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Duration
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  8 weeks of structured learning with flexible scheduling
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: `${theme.palette.success.main}15`,
                      color: theme.palette.success.main,
                      mr: 2,
                    }}
                  >
                    <AssignmentIcon />
                  </Avatar>
                  <Typography 
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Assessments
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {assessments.length} assessments to test your knowledge
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography 
                variant="h5"
                sx={{
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Course Assessments
              </Typography>
              {userRole === "Instructor" && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate(`/courses/${id}/assessments/create`)}
                  sx={{
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 20px -4px ${theme.palette.primary.main}40`,
                    },
                  }}
                >
                  Add Assessment
                </Button>
              )}
            </Box>

            {assessments.length > 0 ? (
              <List>
                {assessments.map((assessment, index) => (
                  <React.Fragment key={assessment.assessmentId}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}
                    <ListItem 
                      sx={{ 
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                        cursor: 'pointer',
                      }}
                      onClick={() => navigate(`/assessments/${assessment.assessmentId}`)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: `${theme.palette.primary.main}15`,
                            color: theme.palette.primary.main,
                            mr: 2,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Typography 
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: 'text.primary',
                              }}
                            >
                              {assessment.title}
                            </Typography>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                              <Chip
                                size="small"
                                icon={<AssignmentIcon sx={{ fontSize: '1rem !important' }} />}
                                label={`${assessment.maxScore} points`}
                                sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }}
                              />
                            </Box>
                          }
                        />
                        {userRole === "Instructor" && (
                          <ListItemSecondaryAction>
                            <Tooltip title="Delete Assessment">
                              <IconButton
                                edge="end"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(assessment.assessmentId);
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
                          </ListItemSecondaryAction>
                        )}
                      </Box>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box 
                sx={{ 
                  textAlign: 'center',
                  py: 4,
                }}
              >
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  No assessments available for this course yet.
                </Typography>
                {userRole === "Instructor" && (
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/courses/${id}/assessments/create`)}
                    sx={{
                      borderRadius: 2,
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    Create First Assessment
                  </Button>
                )}
              </Box>
            )}
          </CardContent>
        </Card>

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

        <Snackbar
          open={Boolean(enrollMsg)}
          autoHideDuration={6000}
          onClose={handleCloseEnrollMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseEnrollMsg}
            severity={enrollMsg.includes('Successfully') ? 'success' : 'error'}
            sx={{ 
              width: '100%',
              borderRadius: 2,
              bgcolor: enrollMsg.includes('Successfully') ? 'success.lighter' : 'error.lighter',
            }}
          >
            {enrollMsg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default CourseDetail;
