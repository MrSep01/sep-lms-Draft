import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        firstName
        lastName
        email
        role  
      }
    }
  }
`;


export const ADD_USER = gql`
  mutation addUser($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    addUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
      token
      user {
        _id
        role
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    updateUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
      _id
      firstName
      lastName
      email
      role
    }
  }
`;

export const ADD_COURSE = gql`
  mutation addCourse($name: String!, $description: String!, $price: Float!, $category: String!, $instructorId: ID!) {
    addCourse(name: $name, description: $description, price: $price, category: $category, instructorId: $instructorId) {
      _id
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation updateCourse($courseId: ID!, $name: String!, $description: String!, $price: Float!, $category: String!) {
    updateCourse(courseId: $courseId, name: $name, description: $description, price: $price, category: $category) {
      _id
    }
  }
`;


export const MARK_LESSON_COMPLETED = gql`
  mutation markLessonCompleted($courseId: ID!, $lessonId: ID!, $userId: ID!) {
    markLessonCompleted(courseId: $courseId, lessonId: $lessonId, userId: $userId) {
      _id
    }
  }
`;

export const CREATE_STRIPE_ACCOUNT = gql`
  mutation CreateStripeAccount {
    createStripeAccount {
      url
    }
  }
`;

export const HANDLE_STRIPE_CALLBACK = gql`
  mutation HandleStripeCallback {
    handleStripeCallback {
      _id
      role
    }
  }
`;


export const REMOVE_IMAGE = gql`
  mutation RemoveImage($imageUrl: String!) {
    removeImage(imageUrl: $imageUrl) {
      success
    }
  }
`;

export const CONFIRM_UPLOAD = gql`
  mutation ConfirmUpload($courseId: ID!, $imageUrl: String!) {
    confirmUpload(courseId: $courseId, imageUrl: $imageUrl)
  }
`;

export const CONFIRM_VIDEO_UPLOAD = gql`
  mutation ConfirmVideoUpload($courseId: ID!, $videoUrl: String!) {
    confirmVideoUpload(courseId: $courseId, videoUrl: $videoUrl)
  }
`;  


export const CHECK_ENROLLMENT = gql`
  mutation checkEnrollment($courseId: ID!) {
    checkEnrollment(courseId: $courseId) {
      status
    }
  }
`;

export const ENROLL_IN_COURSE = gql`
  mutation enrollInCourse($courseId: ID!) {
    enrollInCourse(courseId: $courseId) {
      success
      message
    }
  }
`;

export const ADD_LESSON = gql`
  mutation addLesson($courseId: ID!, $title: String!, $content: String!, $video: String) {
    addLesson(courseId: $courseId, title: $title, content: $content, video: $video) {
      _id
      lessons {
        _id
        title
      }
    }
  }
`;

export const UPDATE_LESSON = gql`
  mutation updateLesson($courseId: ID!, $lessonId: ID!, $title: String!, $content: String!, $video: String) { 
    updateLesson(courseId: $courseId, lessonId: $lessonId, title: $title, content: $content, video: $video) {
      _id
      lessons {
        _id
        title
      }
    }
  }

`;  

export const DELETE_LESSON = gql`
  mutation deleteLesson($courseId: ID!, $lessonId: ID!) {
    deleteLesson(courseId: $courseId, lessonId: $lessonId) {
      _id
      lessons {
        _id
        title
      }
    }
  }
`;



export const PUBLISH_COURSE = gql`
  mutation publishCourse($courseId: ID!) {
    publishCourse(courseId: $courseId) {
      _id
      published
    }
  }
`;

export const UNPUBLISH_COURSE = gql`
  mutation unpublishCourse($courseId: ID!) {
    unpublishCourse(courseId: $courseId) {
      _id
      published
    }
  }
`;