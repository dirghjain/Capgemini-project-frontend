import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { getUserRole } from "../../utils/auth";
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  useTheme,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import {
  School as SchoolIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

export default function CourseEdit() {
  const { courseId } = useParams();
  const [form, setForm] = useState({
    title: "",
    description: "",
    mediaUrl: ""
  });
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const role = getUserRole();
  const theme = useTheme();

  // Get instructorId from token
  let instructorId = "";
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      instructorId =
        decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
        decoded["sub"] ||
        "";
    } catch {
      instructorId = "";
    }
  }

  useEffect(() => {
    if (role !== "Instructor") {
      navigate("/courses");
      return;
    }
    API.get(`/courses/${courseId}`)
      .then(res => {
        setForm({
          title: res.data.title,
          description: res.data.description || "",
          mediaUrl: res.data.mediaUrl || ""
        });
      })
      .catch(() => setError("Failed to load course details."));
  }, [courseId, navigate, role]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg("");
    setError("");
    if (!instructorId) {
      setError("InstructorId not found. Please re-login.");
      return;
    }
    try {
      await API.put(`/courses/${courseId}`, {
        ...form,
        instructorId: instructorId
      });
      setMsg("Course updated successfully!");
      setTimeout(() => navigate(`/courses/${courseId}`), 1200);
    } catch (err) {
      let message = "Failed to update course.";
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "string") message = data;
        else if (data.title) message = data.title;
        else if (data.errors) message = Object.values(data.errors).flat().join(", ");
      }
      setError(message);
    }
  };

  const handleCloseMsg = () => setMsg("");
  const handleCloseError = () => setError("");

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
      <Container maxWidth="md">
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
                Edit Course
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Update your course information
              </Typography>
            </Box>
          </Box>
        </Paper>

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
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                required
                label="Course Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  },
                }}
                placeholder="Enter the course title"
                variant="outlined"
              />

              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Course Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                sx={{ 
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  },
                }}
                placeholder="Describe your course content and objectives"
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Media URL (optional)"
                name="mediaUrl"
                value={form.mediaUrl}
                onChange={handleChange}
                sx={{ 
                  mb: 4,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  },
                }}
                placeholder="Add a link to course media content"
                variant="outlined"
                helperText="Add links to videos, presentations, or other course materials"
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
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
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate(`/courses/${courseId}`)}
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
            </Box>
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
            severity="success"
            sx={{ 
              width: '100%',
              borderRadius: 2,
              bgcolor: 'success.lighter',
            }}
          >
            {msg}
          </Alert>
        </Snackbar>

        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseError}
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
}
