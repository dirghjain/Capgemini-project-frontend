import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  Container,
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Chip,
  Avatar,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

export default function EnrolledStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const theme = useTheme();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await API.get("/courses/enrolled-students");
        setStudents(response.data);
      } catch (err) {
        setError("Failed to load enrolled students");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
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
            Loading enrolled students...
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
              <PeopleIcon sx={{ fontSize: 40 }} />
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
                Enrolled Students
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                Manage and track your course enrollments
              </Typography>
            </Box>
          </Box>
        </Paper>

        {students.length === 0 ? (
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
                <PeopleIcon sx={{ fontSize: 40 }} />
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
                No Students Enrolled
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Students will appear here when they enroll in your courses
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
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ color: theme.palette.primary.main }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Student
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon sx={{ color: theme.palette.primary.main }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Email
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SchoolIcon sx={{ color: theme.palette.primary.main }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Course
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map(s => (
                      <TableRow 
                        key={s.userId + s.courseId} 
                        hover
                        sx={{
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: `${theme.palette.primary.main}08`,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                bgcolor: `${theme.palette.primary.main}15`,
                                color: theme.palette.primary.main,
                              }}
                            >
                              {s.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography>{s.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography color="text.secondary">{s.email}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<SchoolIcon />}
                            label={s.courseTitle}
                            sx={{
                              bgcolor: `${theme.palette.primary.main}15`,
                              color: theme.palette.primary.main,
                              '& .MuiChip-icon': {
                                color: 'inherit',
                              },
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
}
