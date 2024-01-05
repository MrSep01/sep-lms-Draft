// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useMutation } from '@apollo/client';
// import { CREATE_STRIPE_ACCOUNT } from '../../utils/mutations'; // Adjust this path as per your project structure
// import UserNav from '../../components/RoleNav/UserNav'; // Ensure the path is correct
// import { Layout, Button } from 'antd';
// import { UserSwitchOutlined } from '@ant-design/icons';
// import Auth from '../../utils/auth'; // Adjust the path as needed

// const { Content } = Layout; // Assuming Content comes from antd's Layout

// const BecomeInstructor = () => {
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (!Auth.loggedIn()) {
//             navigate('/login');
//         }
//     }, [navigate]);

//     const [createStripeAccount] = useMutation(CREATE_STRIPE_ACCOUNT, {
//         onCompleted: (data) => {
//             setLoading(false);
//             window.location.href = data.createStripeAccount.url; // Redirect to Stripe onboarding
//         },
//         onError: (error) => {
//             setLoading(false);
//             console.error('Error creating Stripe account:', error);
//         },
//     });

//     const handleBecomeInstructor = () => {
//         setLoading(true);
//         createStripeAccount();
//     };

//     return (
//         <div className="container-fluid">
//             <div className="row">
//                 <div className="col-md-2">
//                     <UserNav />
//                 </div>
//                 <div className="col-md-10">
//                     <h1 className="jumbotron text-center square"></h1>
//                     <Content style={{ padding: '50px', minHeight: '100vh' }}>
//                         <div className="jumbotron text-center" style={{ backgroundColor: '#f0f2f5' }}>
//                             <UserSwitchOutlined style={{ fontSize: '76px', color: '#08c' }} />
//                             <h1 className="display-4">Become an Instructor</h1>
//                             <p className="lead">Share your knowledge with thousands of students and earn income on your schedule.</p>
//                             <Button
//                                 type="primary"
//                                 size="large"
//                                 className="mt-4"
//                                 style={{ margin: '50px' }}
//                                 onClick={handleBecomeInstructor}
//                                 loading={loading}
//                             >
//                                 Start Teaching Today
//                             </Button>
//                         </div>
//                     </Content>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BecomeInstructor;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_STRIPE_ACCOUNT } from '../../utils/mutations';
import UserNav from '../../components/RoleNav/UserNav';
import { Layout, Button, Typography, Space } from 'antd';
import { UserSwitchOutlined } from '@ant-design/icons';
import Auth from '../../utils/auth';

const { Content, Sider } = Layout;
const { Title, Paragraph } = Typography;

const BecomeInstructor = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!Auth.loggedIn()) {
            navigate('/login');
        }
    }, [navigate]);

    const [createStripeAccount] = useMutation(CREATE_STRIPE_ACCOUNT, {
        onCompleted: (data) => {
            setLoading(false);
            window.location.href = data.createStripeAccount.url;
        },
        onError: (error) => {
            setLoading(false);
            console.error('Error creating Stripe account:', error);
        },
    });

    const handleBecomeInstructor = () => {
        setLoading(true);
        createStripeAccount();
    };

    return (
        <Layout>
            <Sider width={200} theme="light" breakpoint="md" collapsedWidth="0">
                <UserNav />
            </Sider>
            <Layout style={{ padding: '20px', minHeight: '100vh' }}>
                <Content>
                    <Space direction="vertical" align="center" style={{ width: '100%' }}>
                        <div className="text-center">
                            <UserSwitchOutlined style={{ fontSize: '76px', color: '#08c' }} />
                        </div>
                        <div className="text-center">
                            <Title level={2}>Become an Instructor</Title>
                            <Paragraph>Share your knowledge with thousands of students and earn income on your schedule.</Paragraph>
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleBecomeInstructor}
                                loading={loading}
                            >
                                Start Teaching Today
                            </Button>
                        </div>
                    </Space>
                </Content>
            </Layout>
        </Layout>
    );
};

export default BecomeInstructor;
