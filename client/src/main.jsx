import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import App from './App';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup';
import NoMatch from './pages/NoMatch.jsx';
import UserIndex from './pages/user/index.jsx'; 
import CreateCourse from './pages/Instructor/Course/create.jsx';
import BecomeInstructor from './pages/user/becomeinstructor.jsx';
import StripeOnboardingComplete from './pages/Instructor/stripeOnboardingComplete.jsx';
import InstructorDashboard from './pages/Instructor/index.jsx';
import Course from './pages/user/course.jsx';
import CourseView from './pages/Instructor/Course/courseView.jsx';
import CourseEdit from './pages/Instructor/Course/courseEdit.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NoMatch />, // Corrected property name
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'signup',
        element: <Signup />
      },
      
      {
        path: '*',
        element: <NoMatch />
      }, 
      {
        path: 'user/dashboard',
        element: <UserIndex />
      },
      {
        path: 'instructor/course/create',
        element: <CreateCourse />
      },
      {
        path: 'user/becomeinstructor',
        element: <BecomeInstructor />
      },
      {
        path: 'instructor/dashboard',
        element: <InstructorDashboard />
      },
      {
        path: 'instructor/stripeOnboardingComplete',
        element: <StripeOnboardingComplete />
      },
      {
        path: 'user/courses/:courseId',
        element: <Course />
      } ,

      {
        path: 'instructor/course/view/:courseId',
        element: <CourseView />
      },
{ 
        path: 'instructor/course/edit/:courseId',
        element: <CourseEdit />
}

    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
