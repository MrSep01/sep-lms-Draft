import React from 'react';
import { Button, Typography, Input, Card, Row, Col } from 'antd';
import { CheckOutlined, PlayCircleOutlined } from '@ant-design/icons';
import './home.css'; // make sure to create a corresponding CSS file for styles

const { Title, Paragraph } = Typography;

const HomePage = () => {
    return (
        <div className="home-container">
            <div className="hero-section">
                <Title level={1}>Unlock the World of Learning</Title>
                <Paragraph>
                    Discover a platform where your expertise transforms into educational opportunities. Join us today as a learner or an instructor.
                </Paragraph>
                <div className="feature-list">
                    <CheckOutlined /> Explore a diverse range of courses<br />
                    <CheckOutlined /> Collaborate with passionate educators<br />
                    <CheckOutlined /> Accessible and scalable learning solutions
                </div>
                <div className="cta-buttons">
                    <Input.Search
                        placeholder="Enter your email"
                        enterButton="Start Learning"
                        size="large"
                        onSearch={value => console.log(value)}
                    />
                    <Button type="primary" size="large">Become an Instructor</Button>
                </div>
            </div>

            <Row gutter={16} className="stats-section">
                <Col span={8}>
                    <Card>
                        <Title level={2}>1 Million+</Title>
                        <Paragraph>Learners Enrolled</Paragraph>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Title level={2}>1000+</Title>
                        <Paragraph>Qualified Instructors</Paragraph>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Title level={2}>200+ Categories</Title>
                        <Paragraph>Topics to Explore</Paragraph>
                    </Card>
                </Col>
            </Row>

            <div className="cta-section">
                <PlayCircleOutlined style={{ fontSize: '48px' }} />
                <Title level={2}>Watch a Course Creation Demo</Title>
                <Button type="primary" size="large">Watch Demo</Button>
            </div>
        </div>
    );
};

export default HomePage;
