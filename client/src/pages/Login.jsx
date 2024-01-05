// import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';
// import { Link, useNavigate } from 'react-router-dom';
// import { LOGIN_USER } from '../utils/mutations';
// import Auth from '../utils/auth';
// import { Form, Input, Button, Row, Col, Typography, Alert } from 'antd';

// const { Title } = Typography;

// function Login() {
//   const [formState, setFormState] = useState({ email: '', password: '' });
//   const [login, { error }] = useMutation(LOGIN_USER);
//   const navigate = useNavigate();

//   const onFinish = async () => {
//     try {
//       const mutationResponse = await login({
//         variables: { email: formState.email, password: formState.password },
//       });
//       const token = mutationResponse.data.login.token;
//       Auth.login(token);
//       navigate('/user/dashboard');
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormState({
//       ...formState,
//       [name]: value,
//     });
//   };

//   return (
//     <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
//       <Col xs={24} sm={16} md={12} lg={8}>
//         <Form
//           name="loginForm"
//           onFinish={onFinish}
//           initialValues={{ remember: true }}
//           layout="vertical"
//         >
//           <Title level={3}>Login</Title>
//           <Form.Item
//             label="Email address"
//             name="email"
//             rules={[
//               { required: true, message: 'Please input your email address!' },
//               { type: 'email', message: 'Invalid email address!' },
//             ]}
//             style={{ marginBottom: 16 }}
//           >
//             <Input
//               placeholder="youremail@test.com"
//               name="email"
//               value={formState.email}
//               onChange={handleChange}
//               style={{ borderRadius: '10px' }} // Rounded corners for email field
//             />
//           </Form.Item>
//           <Form.Item
//             label="Password"
//             name="password"
//             rules={[{ required: true, message: 'Please input your password!' }]}
//             style={{ marginBottom: 16 }}
//           >
//             <Input.Password
//               placeholder="******"
//               name="password"
//               value={formState.password}
//               onChange={handleChange}
//               style={{ borderRadius: '10px' }} // Rounded corners for password field
//             />
//           </Form.Item>
//           {error && <Alert message="The provided credentials are incorrect" type="error" />}
//           <Form.Item style={{ marginBottom: 16 }}>
//             <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
//               Submit
//             </Button>
//           </Form.Item>
//         </Form>
//         <div style={{ textAlign: 'center' }}>
//           <Link to="/signup">Don't have an account? Sign Up</Link>
//         </div>
//       </Col>
//     </Row>
//   );
// }

// export default Login;


import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';
import { Form, Input, Button, Row, Col, Typography, Alert } from 'antd';
import { useStoreContext } from '../utils/GlobalState'; // Import useStoreContext

const { Title } = Typography;

function Login() {
  const [state, dispatch] = useStoreContext(); // Use the global state and dispatch
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const onFinish = async () => {
    try {
      const mutationResponse = await login({
        variables: { email: formState.email, password: formState.password },
      });
      const token = mutationResponse.data.login.token;
      const user = mutationResponse.data.login.user; // Extract user data

      Auth.login(token);
      
      const userData= Auth.getUserData(); // Get user data from token

      dispatch({ // Dispatch action to set current user
        type: 'SET_CURRENT_USER',
        user: userData,
      });

      navigate('/user/dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col xs={24} sm={16} md={12} lg={8}>
        <Form
          name="loginForm"
          onFinish={onFinish}
          initialValues={{ remember: true }}
          layout="vertical"
        >
          <Title level={3}>Login</Title>
          <Form.Item
            label="Email address"
            name="email"
            rules={[
              { required: true, message: 'Please input your email address!' },
              { type: 'email', message: 'Invalid email address!' },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input
              placeholder="youremail@test.com"
              name="email"
              value={formState.email}
              onChange={handleChange}
              style={{ borderRadius: '10px' }}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
            style={{ marginBottom: 16 }}
          >
            <Input.Password
              placeholder="******"
              name="password"
              value={formState.password}
              onChange={handleChange}
              style={{ borderRadius: '10px' }}
            />
          </Form.Item>
          {error && <Alert message="The provided credentials are incorrect" type="error" />}
          <Form.Item style={{ marginBottom: 16 }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Link to="/signup">Don't have an account? Sign Up</Link>
        </div>
      </Col>
    </Row>
  );
}

export default Login;
