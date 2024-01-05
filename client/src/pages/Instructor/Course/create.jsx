import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InstructorNav from '../../../components/RoleNav/InstructorNav/index.jsx';
import CourseCreateForm from '../../../components/forms/CourseCreateForm';
import { useMutation, useApolloClient } from '@apollo/client';
import { ADD_COURSE, REMOVE_IMAGE, CONFIRM_UPLOAD } from '../../../utils/mutations';
import { GET_PRESIGNED_UPLOAD_URL } from '../../../utils/queries';
import { toast } from 'react-toastify';
import Auth from '../../../utils/auth';
import { Layout, Typography, Card } from 'antd';

const { Title } = Typography;
const { Sider, Content } = Layout;

const CreateCourse = () => {
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '9.99',
        paid: true,
        category: '',
        image: '',
        imagePreview: '',
        lessons: [],
    });

    const client = useApolloClient();
    const [createCourse] = useMutation(ADD_COURSE);
    const [removeImage] = useMutation(REMOVE_IMAGE);
    const instructorId = Auth.getProfile().data._id;
    const navigate = useNavigate();

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const { data: presignedData } = await client.query({
                query: GET_PRESIGNED_UPLOAD_URL,
                variables: { filename: file.name },
            });

            await fetch(presignedData.getPresignedUploadURL, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            const imageUrl = presignedData.getPresignedUploadURL.split('?')[0];

            await client.mutate({
                mutation: CONFIRM_UPLOAD,
                variables: { imageUrl }
            });

            setValues({ ...values, image: imageUrl, imagePreview: URL.createObjectURL(file) });
            toast.success("Image uploaded successfully");
        } catch (error) {
            toast.error("Failed to upload image");
        }
    };

    const handleImageRemove = async () => {
        try {
            await removeImage({ variables: { imageUrl: values.image } });
            setValues({ ...values, image: '', imagePreview: '' });
            toast.success("Image removed successfully");
        } catch (error) {
            toast.error("Failed to remove image");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createCourse({ variables: { ...values, instructorId, price: parseFloat(values.price) } });
            toast.success("Great! Now you can start adding lessons");
            navigate('/instructor/dashboard'); // Redirect to instructor dashboard
        } catch (error) {
            toast.error("Course creation failed: " + error.message);
        }
    };

    return (
        <Layout>
            <Sider width={200} theme="light" breakpoint="md" collapsedWidth="0">
                <InstructorNav />
            </Sider>
            <Layout style={{ padding: '20px', minHeight: '100vh' }}>
                <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Card style={{ width: '80%' }}>
                        <Title level={3} className="text-center square">Create Course</Title>
                        <CourseCreateForm
                            handleSubmit={handleSubmit}
                            handleImageUpload={handleImageUpload}
                            handleImageRemove={handleImageRemove}
                            handleChange={handleChange}
                            values={values}
                            setValues={setValues}
                            imagePreview={values.imagePreview}
                        />
                    </Card>
                </Content>
            </Layout>
        </Layout>
    );
};

export default CreateCourse;

