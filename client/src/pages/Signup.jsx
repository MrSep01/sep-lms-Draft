import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { ADD_USER } from '../utils/mutations';
import { Form, Input, Button, Row, Col, Typography } from 'antd';

const { Title } = Typography;

function Signup() {
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [addUser] = useMutation(ADD_USER);

  const onFinish = async () => {
    try {
      const mutationResponse = await addUser({
        variables: {
          firstName: formState.firstName,
          lastName: formState.lastName,
          email: formState.email,
          password: formState.password,
        },
      });
      const token = mutationResponse.data.addUser.token;
      Auth.login(token);
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
          name="signupForm"
          onFinish={onFinish}
          layout="vertical"
        >
          <Title level={3}>Signup</Title>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: 'Please input your first name!' },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input
              placeholder="First"
              name="firstName"
              value={formState.firstName}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: 'Please input your last name!' },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input
              placeholder="Last"
              name="lastName"
              value={formState.lastName}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Invalid email address!' },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input
              placeholder="youremail@test.com"
              name="email"
              value={formState.email}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
            ]}
            style={{ marginBottom: 16 }}
          >
            <Input.Password
              placeholder="******"
              name="password"
              value={formState.password}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 16 }}>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </Col>
    </Row>
  );
}

export default Signup;
