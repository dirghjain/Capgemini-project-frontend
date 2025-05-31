import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
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
  useTheme,
  Tooltip,
  Chip,
  Snackbar,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  QuestionAnswer as QuestionIcon,
} from '@mui/icons-material';

export default function InstructorAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await API.get("/courses");
        setCourses(coursesRes.data);
        const courseIds = coursesRes.data.map(c => c.courseId);
        
        const assessmentsRes = await API.get("/assessments");
        setAssessments(
          assessmentsRes.data.filter(a => courseIds.includes(a.courseId))
        );
      } catch (error) {
        setMsg("Failed to load assessments or courses");
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (assessmentId) => {
    if (!window.confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await API.delete(`/assessments/${assessmentId}`);
      setAssessments(prev => prev.filter(a => a.assessmentId !== assessmentId));
      setMsg("Assessment deleted successfully");
    } catch {
      setMsg("Failed to delete assessment");
    }
  };

  const handleCloseMsg = () => setMsg("");

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
                <AssignmentIcon sx={{ fontSize: 40 }} />
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
                  My Assessments
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Manage your course assessments
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/courses")}
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
              Create Assessment
            </Button>
          </Box>
        </Paper>

        {assessments.length === 0 ? (
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
                <AssignmentIcon sx={{ fontSize: 40 }} />
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
                No Assessments Created
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Create your first assessment by selecting a course
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/courses")}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Create First Assessment
              </Button>
            </CardContent>
          </Card>
        ) : (
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
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
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
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                            }}
                          >
                            {assessment.title}
                          </Typography>
                          {assessment.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ 
                                mb: 1,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                lineHeight: 1.6,
                              }}
                            >
                              {assessment.description}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip
                              size="small"
                              icon={<SchoolIcon sx={{ fontSize: '1rem !important' }} />}
                              label={courses.find(c => c.courseId === assessment.courseId)?.title || ""}
                              sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }}
                            />
                            <Chip
                              size="small"
                              icon={<StarIcon sx={{ fontSize: '1rem !important' }} />}
                              label={`${assessment.maxScore} points`}
                              sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }}
                            />
                            <Chip
                              size="small"
                              icon={<QuestionIcon sx={{ fontSize: '1rem !important' }} />}
                              label={`${assessment.questions?.length || 0} questions`}
                              sx={{ bgcolor: 'rgba(0, 0, 0, 0.05)' }}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                          <Tooltip title="Edit Assessment">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/courses/${assessment.courseId}/assessments/${assessment.assessmentId}/edit`);
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
                          <Tooltip title="Delete Assessment">
                            <IconButton
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
                        </Box>
                      </Box>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        <Snackbar
          open={Boolean(msg)}
          autoHideDuration={6000}
          onClose={handleCloseMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseMsg}
            severity={msg.includes("success") ? "success" : "error"}
            sx={{ 
              width: '100%',
              borderRadius: 2,
              bgcolor: msg.includes("success") ? 'success.lighter' : 'error.lighter',
            }}
          >
            {msg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
