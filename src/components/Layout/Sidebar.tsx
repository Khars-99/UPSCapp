import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  MenuBook,
  Quiz,
  Newspaper,
  Assessment,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const drawerWidth = 280;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: Dashboard, path: '/' },
  { text: 'Knowledge Base', icon: MenuBook, path: '/knowledge' },
  { text: 'Test Generator', icon: Quiz, path: '/tests' },
  { text: 'Current Affairs', icon: Newspaper, path: '/current-affairs' },
  { text: 'Answer Evaluator', icon: Assessment, path: '/evaluator' },
];

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1e3a8a, #f59e0b)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          UPSC Mentor
        </Typography>
      </Toolbar>
      <Divider />
      
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1, px: 2 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : 'primary.main' }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={toggleTheme}
          sx={{
            borderRadius: 2,
            justifyContent: 'center',
          }}
        >
          <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </ListItemIcon>
          <ListItemText 
            primary={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            primaryTypographyProps={{ fontSize: '0.875rem' }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: drawerWidth,
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export const PermanentSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', sm: 'block' },
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1e3a8a, #f59e0b)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            UPSC Mentor
          </Typography>
        </Toolbar>
        <Divider />
        
        <List sx={{ flexGrow: 1, pt: 2 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1, px: 2 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? 'white' : 'primary.main' }}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider />
        <Box sx={{ p: 2 }}>
          <ListItemButton
            onClick={toggleTheme}
            sx={{
              borderRadius: 2,
              justifyContent: 'center',
            }}
          >
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
              {isDarkMode ? <LightMode /> : <DarkMode />}
            </ListItemIcon>
            <ListItemText 
              primary={isDarkMode ? 'Light Mode' : 'Dark Mode'}
              primaryTypographyProps={{ fontSize: '0.875rem' }}
            />
          </ListItemButton>
        </Box>
      </Box>
    </Drawer>
  );
};