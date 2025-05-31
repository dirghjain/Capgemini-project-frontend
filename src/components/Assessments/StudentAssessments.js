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
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  Chip,
  Avatar,
  Card,
  CardContent,
  Snackbar,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  School as SchoolIcon,
  Timer as TimerIcon,
  Star as StarIcon,
  QuestionAnswer as QuestionIcon,
} from '@mui/icons-material';

export default function StudentAssessments() {
  const [assessments, setAssessments] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await API.get("/courses/enrolled");
        const ids = courseRes.data.map(c => c.courseId);
        
        const assessRes = await API.get("/assessments");
        const userAssessments = assessRes.data.filter(a =>
          ids.includes(a.courseId)
        );
        setAssessments(userAssessments);
      } catch (error) {
        setMsg("Failed to load assessments or enrolled courses");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh',
          pt: 4,
          pb: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress 
            size={60}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              mb: 2,
            }}
          />
          <Typography 
            variant="h6"
            sx={{
              fontWeight: 500,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Loading your assessments...
          </Typography>
        </Box>
      </Box>
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
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 3 }}>
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
                Track and complete your course assessments
              </Typography>
            </Box>
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
                No Assessments Available
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Check back later for new assessments from your enrolled courses
              </Typography>
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
                          <Box sx={{ display: 'flex', gap: 1 }}>
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
          onClose={() => setMsg("")}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setMsg("")}
            severity="error"
            sx={{ 
              width: '100%',
              borderRadius: 2,
              bgcolor: 'error.lighter',
            }}
          >
            {msg}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
