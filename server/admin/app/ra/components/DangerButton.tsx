import { styled, alpha } from '@mui/material';
import { Button } from 'react-admin';

export const DangerButton = styled(Button, {
  name: 'DangerBtn',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  color: theme.palette.error.main,
  '&:hover': {
    backgroundColor: alpha(theme.palette.error.main, 0.12),
    // Reset on mouse devices
    '@media (hover: none)': {
      backgroundColor: 'transparent',
    },
  },
}));
DangerButton.displayName = 'DangerButton';
