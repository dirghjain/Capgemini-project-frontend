import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { getUserRole } from "../../utils/auth";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Link,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  Book as BookIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Create as CreateIcon,
  Group as GroupIcon,
} from '@mui/icons-material';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const instructorMenuItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { text: 'Courses', path: '/courses', icon: <BookIcon /> },
    { text: 'Results', path: '/results', icon: <AssessmentIcon /> },
  ];

  const studentMenuItems = [
    { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { text: 'Courses', path: '/courses', icon: <BookIcon /> },
    { text: 'My Courses', path: '/my-courses', icon: <SchoolIcon /> },
    { text: 'Assessments', path: '/assessments', icon: <AssessmentIcon /> },
    { text: 'Results', path: '/results', icon: <AssessmentIcon /> },
  ];

  const menuItems = getUserRole() === "Instructor" ? instructorMenuItems : studentMenuItems;

  const userMenuItems = [
    { text: 'Profile', path: '/profile', icon: <PersonIcon /> },
  ];

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Typography
        variant="h6"
        component="div"
        sx={{
          px: 2,
          mb: 3,
          fontWeight: 700,
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        EduSync
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 1,
              '&:hover': {
                bgcolor: 'rgba(0, 137, 123, 0.08)',
                '& .MuiListItemIcon-root': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo and Mobile Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && isLoggedIn && (
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                textDecoration: 'none',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.5px',
              }}
            >
              EduSync
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {isLoggedIn && !isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'rgba(0, 137, 123, 0.08)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* User Menu */}
          {isLoggedIn ? (
            <Box sx={{ flexShrink: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    boxShadow: theme.shadows[3],
                    mt: 1,
                  },
                }}
              >
                {userMenuItems.map((item) => (
                  <MenuItem
                    key={item.text}
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate(item.path);
                    }}
                    sx={{
                      borderRadius: 1,
                      mx: 0.5,
                      gap: 1.5,
                      '&:hover': {
                        bgcolor: 'rgba(0, 137, 123, 0.08)',
                      },
                    }}
                  >
                    {item.icon}
                    <Typography textAlign="center">{item.text}</Typography>
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={onLogout}
                  sx={{
                    borderRadius: 1,
                    mx: 0.5,
                    gap: 1.5,
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: 'error.lighter',
                    },
                  }}
                >
                  <LogoutIcon />
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                sx={{
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                sx={{
                  '&:hover': {
                    transform: 'translateY(-1px)',
                  },
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;

