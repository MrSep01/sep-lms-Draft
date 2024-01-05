const typeDefs = `
  scalar Upload
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    picture: String
    role: [String]
    courses: [Course]
  }

  type Lesson {
    _id: ID
    title: String
    slug: String
    content: String
    video: String
    free_preview: Boolean
  }

  type Course {
    _id: ID
    name: String
    slug: String
    description: String
    price: Float
    image: String
    category: String
    published: Boolean
    unpublish: Boolean
    paid: Boolean
    CreatedAt: String
    updatedAt: String
    instructor: User
    lessons: [Lesson]
  }

  type Completed {
    _id: ID
    user: User
    course: Course
    lessons: [Lesson]
  }

  type Auth {
    token: ID
    user: User
  }

  type StripeAccountResponse {
    url: String
  }

  type ImageResponse {
    success: Boolean!
    imageUrl: String
  }

  type Query {
    users: [User]
    user(_id: ID!): User
    courses: [Course]
    course(_id: ID!): Course
    completed(_id: ID!): Completed
    completeds: [Completed]
    getPresignedUploadURL(filename: String!): String!
    test: String
  }

  type Mutation {
    addUser(firstName: String!, lastName: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    updateUser(_id: ID!, firstName: String, lastName: String, email: String, password: String): User
    addCourse(name: String!, description: String!, price: Float!, category: String!, instructorId: ID!): Course
    publishCourse(courseId: ID!): Course
    unpublishCourse(courseId: ID!): Course
    addLesson(courseId: ID!, title: String!, content: String!, video: String, free_preview: Boolean): Course
    updateLesson(courseId: ID!, lessonId: ID!, title: String!, content: String!, video: String, free_preview: Boolean): Course
    deleteLesson(courseId: ID!, lessonId: ID!): Course
    markLessonCompleted(courseId: ID!, lessonId: ID!, userId: ID!): Completed
    createStripeAccount: StripeAccountResponse
    handleStripeCallback: User
    removeImage(imageUrl: String!): ImageResponse
    confirmUpload(imageUrl: String!): Boolean!
    checkEnrollment(courseId: ID!, userId: ID!): EnrollmentStatus
    enrollInCourse(courseId: ID!): EnrollmentResponse
  }

  type EnrollmentStatus {
    status: Boolean!
  }

  type EnrollmentResponse {
    success: Boolean!
    message: String!
  }
`;

module.exports = typeDefs;
