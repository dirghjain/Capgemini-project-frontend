import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { getUserRole } from "../../utils/auth";
import {
  Container,
  Box,
  Paper,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  Chip,
  Avatar,
  LinearProgress,
  Snackbar,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Send as SendIcon,
  Check as CheckIcon,
  Star as StarIcon,
  QuestionAnswer as QuestionIcon,
  School as SchoolIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

const AssessmentDetail = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const userRole = getUserRole();
  const theme = useTheme();

  // 1. Check if the user already attempted this assessment
  useEffect(() => {
    const checkAttemptStatus = async () => {
      if (userRole === "Student" && assessmentId) {
        try {
          const res = await API.get(`/assessments/${assessmentId}/attempt-status`);
          if (res.data.attempted) setAlreadyAttempted(true);
          else setAlreadyAttempted(false);
        } catch (err) {
          setAlreadyAttempted(false);
        }
      }
    };
    checkAttemptStatus();
  }, [assessmentId, userRole]);

  // 2. Fetch assessment data
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await API.get(`/assessments/${assessmentId}`);
        setAssessment(response.data);
      } catch (err) {
        setError(
          err.response && err.response.status === 404
            ? "Assessment not found (404)."
            : "Failed to load assessment. Please try again."
        );
        console.error("Error loading assessment:", err);
      } finally {
        setLoading(false);
      }
    };

    if (assessmentId) {
      fetchAssessment();
    }
  }, [assessmentId]);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    
    if (Object.keys(userAnswers).length !== assessment.questions.length) {
      setError("Please answer all questions before submitting.");
      return;
    }

    try {
      const response = await API.post(`/assessments/${assessmentId}/attempt`, {
        answers: userAnswers
      });
      setScore(response.data.score);
      setSubmitted(true);
    } catch (err) {
      setError("Failed to submit assessment. Please try again.");
      console.error("Error submitting assessment:", err);
    }
  };

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
            Loading assessment...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error || !assessment) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert 
            severity="error"
            sx={{ 
              borderRadius: 2,
              bgcolor: 'error.lighter',
            }}
          >
            {error || "Assessment not found"}
          </Alert>
        </Box>
      </Container>
    );
  }

  if (alreadyAttempted && userRole === "Student") {
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
              background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
              color: 'white',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
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
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                  margin: '0 auto 16px',
                }}
              >
                <CheckIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography 
                variant="h4"
                sx={{ 
                  fontWeight: 700,
                  mb: 2,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Assessment Already Completed
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                You have already attempted this assessment. Each assessment can only be taken once.
              </Typography>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.warning.main,
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Go Back
              </Button>
            </Box>
          </Paper>
        </Container>
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
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 3 }}>
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
                {assessment.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  icon={<QuestionIcon />}
                  label={`${assessment.questions.length} Questions`}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                  }}
                />
                <Chip
                  icon={<StarIcon />}
                  label={`${assessment.maxScore} Points`}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        {submitted ? (
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              textAlign: 'center',
              py: 8,
            }}
          >
            <CardContent>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: `${theme.palette.success.main}15`,
                  color: theme.palette.success.main,
                  margin: '0 auto 24px',
                }}
              >
                <CheckIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography 
                variant="h4"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                }}
              >
                Assessment Completed!
              </Typography>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                Your Score:
              </Typography>
              <Typography 
                variant="h2" 
                sx={{ 
                  color: theme.palette.success.main,
                  fontWeight: 700,
                  mb: 4,
                }}
              >
                {score}/{assessment.maxScore}
              </Typography>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
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
                Return to Course
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card
            component="form"
            onSubmit={handleSubmit}
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
                {assessment.questions.map((question, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <Divider sx={{ my: 3 }} />}
                    <ListItem
                      sx={{ 
                        display: 'block',
                        px: 2,
                        py: 1.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: `${theme.palette.primary.main}15`,
                            color: theme.palette.primary.main,
                            mr: 2,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <Typography 
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {question.questionText}
                        </Typography>
                      </Box>

                      <FormControl 
                        component="fieldset" 
                        sx={{ 
                          width: '100%',
                          pl: 7,
                        }}
                      >
                        <RadioGroup
                          value={userAnswers[question.questionId] || ""}
                          onChange={(e) => handleAnswerChange(question.questionId, e.target.value)}
                        >
                          {['A', 'B', 'C', 'D'].map((option) => (
                            <FormControlLabel
                              key={option}
                              value={option}
                              control={
                                <Radio 
                                  sx={{
                                    color: theme.palette.primary.main,
                                    '&.Mui-checked': {
                                      color: theme.palette.primary.main,
                                    },
                                  }}
                                />
                              }
                              label={
                                <Typography 
                                  variant="body1"
                                  sx={{
                                    color: 'text.primary',
                                    transition: 'color 0.2s',
                                    '&:hover': {
                                      color: theme.palette.primary.main,
                                    },
                                  }}
                                >
                                  {question[`option${option}`]}
                                </Typography>
                              }
                              sx={{
                                mb: 1,
                                p: 1,
                                borderRadius: 1,
                                transition: 'all 0.2s',
                                '&:hover': {
                                  bgcolor: `${theme.palette.primary.main}08`,
                                },
                              }}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>

              <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SendIcon />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 20px -4px ${theme.palette.primary.main}40`,
                    },
                  }}
                >
                  Submit Assessment
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(-1)}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontWeight: 600,
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError("")}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setError("")}
            severity="error"
            sx={{ 
              width: '100%',
              borderRadius: 2,
              bgcolor: 'error.lighter',
            }}
          >
            {error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AssessmentDetail;
