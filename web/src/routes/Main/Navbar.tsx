import React from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';

/**
 * 导航栏组件
 */
const Navbar: React.FC = React.memo(() => {
  const userInfo = useAppSelector((state) => state.user.info);

  return <div></div>;
});
Navbar.displayName = 'Navbar';
