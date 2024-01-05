import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const InstructorNav = () => {
  const [current, setCurrent] = useState('');
  const location = useLocation();

  useEffect(() => {
    setCurrent(location.pathname);
  }, [location]);

  return (
    <div className="nav flex-column nav-pills">
      <Link to="/instructor/dashboard" className={`nav-link ${current === '/instructor/dashboard' ? 'active' : ''}`}>
        Dashboard
      </Link>
      <Link to="/instructor/course/create" className={`nav-link ${current === '/instructor/course/create' ? 'active' : ''}`}>
        Create Course
      </Link>
      <Link to="/instructor/revenue" className={`nav-link ${current === '/instructor/revenue' ? 'active' : ''}`}>
        Revenue
      </Link>
    </div>
  );
};

export default InstructorNav;
