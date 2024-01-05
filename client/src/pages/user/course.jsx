import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_COURSE } from '../../utils/queries';
import { ENROLL_IN_COURSE, CHECK_ENROLLMENT } from '../../utils/mutations';

import SingleCourseJumbotron from '../../components/cards/SingleCourseJumbotron';
import PreviewModal from '../../components/modal/PreviewModal';
import SingleCourseLessons from '../../components/cards/SingleCourseLessons';
import { toast } from 'react-toastify';

const SingleCourse = () => {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState('');
  const [enrolled, setEnrolled] = useState(false);
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();
  const client = useApolloClient(); // Define the Apollo client here


  const { data, loading, error } = useQuery(GET_COURSE, {
    variables: { courseId },
  });

  const [enrollInCourse] = useMutation(ENROLL_IN_COURSE, {
    variables: { courseId },
    onCompleted: () => {
      setEnrolled(true);
      toast.success("Enrollment successful");
    },
    onError: (error) => {
      toast.error("Enrollment failed: " + error.message);
    }
  });

  useEffect(() => {
    // Check enrollment status when the component mounts
    const checkEnrollmentStatus = async () => {
      try {
        const { data } = await client.mutation({
          mutation: CHECK_ENROLLMENT,
          variables: { courseId },
        });
        setEnrolled(data.checkEnrollment.status);
      } catch (error) {
        console.error("Error checking enrollment status", error);
      }
    };

    checkEnrollmentStatus();
  }, [courseId, client]);

  const handleEnrollment = () => {
    if (!enrolled) {
      enrollInCourse();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading course</div>;

  const course = data?.course;

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
        enrolled={enrolled}
        handleEnrollment={handleEnrollment}
      />
      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      />
      {course?.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default SingleCourse;

