import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useApolloClient } from '@apollo/client'; // Import useApolloClient
import { GET_COURSE, GET_PRESIGNED_UPLOAD_URL} from '../../../utils/queries';
import { UPDATE_COURSE, UPDATE_LESSON, DELETE_LESSON, CONFIRM_VIDEO_UPLOAD} from '../../../utils/mutations';
import CourseCreateForm from '../../../components/forms/CourseCreateForm';
import UpdateLessonForm from '../../../components/forms/UpdateLessonForm';
import { toast } from 'react-toastify';
import { Progress } from 'antd';

const CourseEdit = () => {
  const [course, setCourse] = useState(null);
  const { courseId } = useParams();
  const navigate = useNavigate();
  const client = useApolloClient();

  const { data, loading, error } = useQuery(GET_COURSE, { variables: { courseId } });
  const [updateCourse] = useMutation(UPDATE_COURSE);
  const [updateLesson] = useMutation(UPDATE_LESSON);
  const [deleteLesson] = useMutation(DELETE_LESSON);

  useEffect(() => {
    if (data && data.course) {
      setCourse(data.course);
    }
  }, [data]);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCourse({ variables: { courseId, ...course } });
      toast.success("Course updated successfully");
    } catch (error) {
      toast.error("Course update failed: " + error.message);
    }
  };

  const handleLessonUpdate = async (lessonId, lessonData) => {
    try {
      await updateLesson({ variables: { courseId, lessonId, ...lessonData } });
      toast.success("Lesson updated successfully");
    } catch (error) {
      toast.error("Lesson update failed: " + error.message);
    }
  };

  const handleLessonDelete = async (lessonId) => {
    try {
      await deleteLesson({ variables: { courseId, lessonId } });
      setCourse({ ...course, lessons: course.lessons.filter(l => l._id !== lessonId) });
      toast.success("Lesson deleted successfully");
    } catch (error) {
      toast.error("Lesson deletion failed: " + error.message);
    }
  };

  const handleVideoUpload = async (e, lessonId) => {
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

      const videoUrl = presignedData.getPresignedUploadURL.split('?')[0];

      await client.mutate({
        mutation: CONFIRM_VIDEO_UPLOAD,
        variables: { videoUrl }
      });

      const newLessons = [...course.lessons];
      const updatedLessonIndex = newLessons.findIndex(lesson => lesson._id === lessonId);
      newLessons[updatedLessonIndex] = { ...newLessons[updatedLessonIndex], video: { Location: videoUrl } };

      setCourse({ ...course, lessons: newLessons });
      toast.success("Video uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload video");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="course-edit-container">
      <h2>Edit Course</h2>
      {course && (
        <>
          <CourseCreateForm 
            handleSubmit={handleCourseSubmit} 
            handleChange={handleChange}
            values={course} 
          />
          {course.lessons.map((lesson, index) => (
            <UpdateLessonForm
              key={lesson._id}
              current={lesson}
              setCurrent={(updatedLesson) => {
                const newLessons = [...course.lessons];
                newLessons[index] = updatedLesson;
                setCourse({ ...course, lessons: newLessons });
              }}
              handleUpdateLesson={(e) => {
                e.preventDefault();
                handleLessonUpdate(lesson._id, course.lessons[index]);
              }}
              handleVideo={(e) => handleVideoUpload(e, lesson._id)}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default CourseEdit;
