import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query getUsers {
    users {
      _id
      firstName
      lastName
      email
      picture
      role
    }
  }
`;

export const GET_USER = gql`
  query getUser($userId: ID!) {
    user(_id: $userId) {
      _id
      firstName
      lastName
      email
      picture
      role
      courses {
        _id
        name
        description
        price
        category
        published
        paid
        instructor {
          _id
          firstName
          lastName
        }
        lessons {
          _id
          title
          slug
          content
          video
          free_preview
        }
      }
    }
  }
`;

export const GET_COURSES = gql`
  query getCourses {
    courses {
      _id
      name
      slug
      description
      price
      image
      category
      published
      paid
      instructor {
        _id
        firstName
        lastName
      }
      lessons {
        _id
        title
        slug
        content
        video
        free_preview
      }
    }
  }
`;

export const GET_COURSE = gql`
  query getCourse($courseId: ID!) {
    course(_id: $courseId) {
      _id
      name
      slug
      description
      price
      image
      category
      published
      paid
      updatedAt
      instructor {
        _id
        firstName
        lastName
      }
      lessons {
        _id
        title
        slug
        content
        video
        free_preview
      }
    }
  }
`;

export const GET_COMPLETEDS = gql`
  query getCompleteds {
    completeds {
      _id
      user {
        _id
        firstName
        lastName
      }
      course {
        _id
        name
      }
      lessons {
        _id
        title
      }
    }
  }
`;

export const GET_COMPLETED = gql`
  query getCompleted($completedId: ID!) {
    completed(_id: $completedId) {
      _id
      user {
        _id
        firstName
        lastName
      }
      course {
        _id
        name
      }
      lessons {
        _id
        title
      }
    }
  }
`;


export const GET_PRESIGNED_UPLOAD_URL = gql`
  query GetPresignedUploadURL($filename: String!) {
    getPresignedUploadURL(filename: $filename)
  }
`;


