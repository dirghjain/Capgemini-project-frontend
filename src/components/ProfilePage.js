import React, { useEffect, useState } from "react";
import API from "../services/api";
import { getUserId } from "../utils/auth";
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Skeleton,
  Card,
  CardContent,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const ProfileField = ({ icon, label, value }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        mb: 2,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 20px -10px ${theme.palette.primary.main}20`,
        },
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          sx={{
            bgcolor: `${theme.palette.primary.main}15`,
            color: theme.palette.primary.main,
            mr: 2,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            {label}
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    API.get(`/users/${getUserId()}`)
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, []);

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
          <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 3 }}>
            {loading ? (
              <Skeleton 
                variant="circular" 
                width={100} 
                height={100}
                sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <PersonIcon sx={{ fontSize: 50 }} />
              </Avatar>
            )}
            <Box>
              <Typography 
                variant="h3" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                {loading ? <Skeleton width={300} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} /> : user?.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {loading ? (
                  <Skeleton width={100} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                ) : (
                  <>
                    <Chip
                      icon={<BadgeIcon />}
                      label={user?.role}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                    <Chip
                      icon={<EmailIcon />}
                      label={user?.email}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>

        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} key={item}>
                <Skeleton 
                  variant="rectangular" 
                  height={100} 
                  sx={{ 
                    borderRadius: 3,
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: `${item * 0.2}s`,
                  }} 
                />
              </Grid>
            ))}
          </Grid>
        ) : user ? (
          <>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Profile Information
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <ProfileField
                  icon={<PersonIcon />}
                  label="Full Name"
                  value={user.name}
                />
                <ProfileField
                  icon={<EmailIcon />}
                  label="Email Address"
                  value={user.email}
                />
                <ProfileField
                  icon={<BadgeIcon />}
                  label="Role"
                  value={user.role}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ProfileField
                  icon={<AccessTimeIcon />}
                  label="Last Active"
                  value={new Date(user.lastActive || Date.now()).toLocaleDateString()}
                />
                <ProfileField
                  icon={<CheckCircleIcon />}
                  label="Status"
                  value="Active"
                />
              </Grid>
            </Grid>
          </>
        ) : null}
      </Container>
    </Box>
  );
};

export default ProfilePage;
