import React from 'react';
import Auth from "../../utils/auth";
import { Link } from "react-router-dom";
import { Menu } from "antd";
import { useStoreContext } from '../../utils/GlobalState';
import {
  AppstoreOutlined,
  LoginOutlined,
  UserAddOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

import './Nav.css'; // Import a CSS file for custom styling

const { Item, SubMenu } = Menu;

const Nav = () => {
  const [state] = useStoreContext();
  const isLoggedIn = Auth.loggedIn();
  const userProfile = state.user || (isLoggedIn ? Auth.getProfile().data : null);
  const username = userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'User';
  const isInstructor = userProfile && userProfile.role.includes('instructor');

  return (
    <Menu mode="horizontal" className="custom-navbar"> {/* Apply custom class for styling */}
      <Item icon={<AppstoreOutlined />}>
        <Link to="/">Home</Link>
      </Item>

      {isLoggedIn && !isInstructor && (
        <Item key="become-instructor" icon={<TeamOutlined />}>
          <Link to="/user/becomeinstructor">Become Instructor</Link>
        </Item>
      )}

      {isLoggedIn && isInstructor && (
        <>
          <Item key="instructor-dashboard" icon={<DashboardOutlined />}>
            <Link to="/instructor/dashboard">Instructor Dashboard</Link>
          </Item>
          <Item key="create-course" icon={<PlusCircleOutlined />}>
            <Link to="/instructor/course/create">Create Course</Link>
          </Item>
        </>
      )}

      {!isLoggedIn && (
        <>
          <Item icon={<LoginOutlined />}>
            <Link to="/login">Login</Link>
          </Item>
          <Item icon={<UserAddOutlined />}>
            <Link to="/signup">Sign Up</Link>
          </Item>
        </>
      )}

      {isLoggedIn && (
        <SubMenu 
          key="SubMenu" 
          icon={<UserOutlined />} 
          title={username} 
          style={{ marginLeft: 'auto' }}
          popupClassName="custom-submenu" // Apply custom class for submenu styling
        >
          <Item key="user-dashboard">
            <Link to="/user/dashboard">
              <DashboardOutlined /> Dashboard
            </Link>
          </Item>
          {isInstructor && (
            <Item key="instructor-dashboard-submenu">
              <Link to="/instructor/dashboard">
                <DashboardOutlined /> Instructor Dashboard
              </Link>
            </Item>
          )}
          {isInstructor && (
            <Item key="create-course-submenu">
              <Link to="/course/create">
                <PlusCircleOutlined /> Create Course
              </Link>
            </Item>
          )}
          <Item key="logout-submenu" onClick={() => Auth.logout()}>
            <LogoutOutlined /> Logout
          </Item>
        </SubMenu>
      )}
    </Menu>
  );
};

export default Nav;
