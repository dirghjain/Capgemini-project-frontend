import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { getUserRole } from "../../utils/auth";
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
  Alert,
  useTheme,
  Chip,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Score as ScoreIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Star as StarIcon,
} from '@mui/icons-material';

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const role = getUserRole();
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resultsRes, assessmentsRes] = await Promise.all([
          API.get("/results"),
          API.get("/assessments")
        ]);
        
        setResults(resultsRes.data);
        setAssessments(assessmentsRes.data);

        if (role === "Instructor") {
          const usersRes = await API.get("/users");
          setUsers(usersRes.data);
        }
      } catch (err) {
        setMsg("Failed to load results");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  const getAssessmentTitle = (id) => {
    const assessment = assessments.find(a => a.assessmentId === id);
    return assessment ? assessment.title : "Assessment";
  };

  const getStudentName = (userId) => {
    const user = users.find(u => u.userId === userId);
    return user ? user.name : userId;
  };

  const parseUtc = (dt) => {
    if (!dt) return "";
    if (dt.endsWith("Z")) return new Date(dt);
    if (dt.includes("T")) return new Date(dt + "Z");
    return new Date(dt.replace(" ", "T") + "Z");
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
            Loading results...
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
              <AssessmentIcon sx={{ fontSize: 40 }} />
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
                {role === "Instructor" ? "Student Results" : "My Assessment Results"}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
                {role === "Instructor" 
                  ? "Track and analyze student performance"
                  : "View your assessment scores and progress"
                }
              </Typography>
            </Box>
          </Box>
        </Paper>

        {results.length === 0 ? (
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
                <ScoreIcon sx={{ fontSize: 40 }} />
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
                No Results Available
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {role === "Instructor" 
                  ? "No students have completed any assessments yet"
                  : "Complete some assessments to see your results here"
                }
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
                      {role === "Instructor" && (
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PersonIcon sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              Student
                            </Typography>
                          </Box>
                        </TableCell>
                      )}
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SchoolIcon sx={{ color: theme.palette.primary.main }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Assessment
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StarIcon sx={{ color: theme.palette.primary.main }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Score
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EventIcon sx={{ color: theme.palette.primary.main }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Date (IST)
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map(r => (
                      <TableRow 
                        key={r.resultId} 
                        hover
                        sx={{
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: `${theme.palette.primary.main}08`,
                            transform: 'translateY(-2px)',
                          },
                        }}
                      >
                        {role === "Instructor" && (
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{
                                  bgcolor: `${theme.palette.primary.main}15`,
                                  color: theme.palette.primary.main,
                                }}
                              >
                                {getStudentName(r.userId).charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography>{getStudentName(r.userId)}</Typography>
                            </Box>
                          </TableCell>
                        )}
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {getAssessmentTitle(r.assessmentId)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<StarIcon />}
                            label={r.score}
                            sx={{
                              bgcolor: `${theme.palette.success.main}15`,
                              color: theme.palette.success.main,
                              fontWeight: 600,
                              '& .MuiChip-icon': {
                                color: 'inherit',
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography color="text.secondary">
                            {parseUtc(r.attemptDate).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit"
                            })}
                          </Typography>
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
