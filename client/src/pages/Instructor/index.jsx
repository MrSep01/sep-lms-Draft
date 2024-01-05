// instructor dashboard page
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../utils/queries';
import Auth from '../../utils/auth';
import { useStoreContext } from '../../utils/GlobalState';
import UserNav from '../../components/RoleNav/InstructorNav';
import { List, Avatar, Tooltip, Switch, Button, message } from 'antd';
import { BookOutlined, CheckCircleOutlined, CloseCircleOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import './index.css';

const InstructorDashboard = () => {
    const [state] = useStoreContext();
    const navigate = useNavigate();
    const isLoggedIn = Auth.loggedIn();
    const userProfile = state.user || (isLoggedIn ? Auth.getProfile().data : null);
    const isInstructor = userProfile && userProfile.role.includes('instructor');

    useEffect(() => {
        if (!isLoggedIn || !isInstructor) {
            navigate('/login');
        }
    }, [isLoggedIn, isInstructor, navigate]);

    const { data, loading, error } = useQuery(GET_USER, {
        variables: { userId: userProfile?._id },
        skip: !isInstructor,
    });

    const handleNavigateToCourse = (courseId) => {
        navigate(`/user/courses/${courseId}`);
    };

    const handleViewCourse = (courseId) => {
        navigate(`/instructor/course/view/${courseId}`);
    };

    const handleEditCourse = (courseId) => {
        navigate(`/instructor/course/edit/${courseId}`);
    };

    const handleDeleteCourse = (courseId) => {
        // Implement delete functionality
    };

    const handlePublish = (courseId, checked) => {
        const course = data.user.courses.find(course => course._id === courseId);
        if (course.lessons.length < 5 && checked) {
            message.error('Cannot publish course with less than 5 lessons');
            return;
        }
        console.log(`Course ID: ${courseId} Published: ${checked}`);
        // Implement the actual publish/unpublish logic here
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col-md-10">
                    <h1 className="jumbotron text-center square">Instructor Dashboard</h1>
                    <List
                        itemLayout="horizontal"
                        dataSource={data?.user?.courses}
                        renderItem={course => (
                            <List.Item 
                                actions={[
                                    <Button icon={<EyeOutlined />} onClick={() => handleViewCourse(course._id)}>View as Instructor</Button>,
                                    <Button onClick={() => handleNavigateToCourse(course._id)}>Go to Course as User</Button>,
                                    <Switch 
                                        checkedChildren={<CheckCircleOutlined />} 
                                        unCheckedChildren={<CloseCircleOutlined />} 
                                        checked={course.published}
                                        onChange={checked => handlePublish(course._id, checked)}
                                        disabled={course.lessons.length < 5}
                                    />,
                                    <Button icon={<EditOutlined />} onClick={() => handleEditCourse(course._id)}>Edit</Button>,
                                    <Button icon={<DeleteOutlined />} onClick={() => handleDeleteCourse(course._id)}>Delete</Button>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar icon={<BookOutlined />} />}
                                    title={<Tooltip title={course.description}>{course.name}</Tooltip>}
                                    description={
                                        <>
                                            <p>Number of Lessons: {course.lessons.length}</p>
                                            <p>Status: {course.published ? "Published" : "Unpublished"}</p>
                                            {course.lessons.length < 5 && <p style={{ color: 'red' }}>Cannot publish (Less than 5 lessons)</p>}
                                        </>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;
