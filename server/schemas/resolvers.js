const { User, Course, Completed } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
const s3 = require('../utils/aws-config');

const localBaseUrl = "http://localhost:3001";
const refreshUrl = `${localBaseUrl}/restart-onboarding`;
const returnUrl = `${localBaseUrl}/instructor/stripeOnboardingComplete`;

const resolvers = {
  Query: {

    test: (_, args, context) => {
      console.log("Context in test resolver:", context);
      return "Test response";
    },
    users: async () => {
      return await User.find({});
    },
    // user: async (parent, { _id }) => {
    //   return await User.findById(_id);
    // },

    user: async (parent, { _id }) => {
      return await User.findById(_id).populate({
        path: 'courses',
        populate: { path: 'instructor' }
      });
    },
    
    courses: async () => {
      return await Course.find({}).populate('instructor');
    },
    course: async (parent, { _id }) => {
      console.log("Received course ID:", _id);
      const courseData = await Course.findById(_id).populate('instructor').populate('lessons');
      console.log("Course Data:", courseData);
      return courseData;
    },

    course: async (parent, { _id }) => {
      return await Course.findById(_id).populate('instructor').populate('lessons');
    },
    
    completed: async (parent, { _id }) => {
      return await Completed.findById(_id).populate('user');
    },
    completeds: async () => {
      return await Completed.find({}).populate('user').populate('course');
    },

    getPresignedUploadURL: async (_, { filename }, context) => {
      const { s3 } = context; // Get the s3 instance from the context
      console.log ("s3 instance: ", s3);
      console.log("Context:", context); // Check the entire context

      const params = {
        Bucket: 'sep01lmsbucket', // replace with your actual bucket name
        Key: filename,
        Expires: 60, // URL expiry time in seconds
      };
      try {
        const url = await s3.getSignedUrlPromise('putObject', params);
        return url;
      } catch (error) {
        console.error("Error generating signed URL", error);
        throw new Error("Error generating signed URL");
      }
    },
   

  },
  Mutation: {
    addUser: async (parent, { firstName, lastName, email, password }) => {
      const user = new User({ firstName, lastName, email, password });
      const token = signToken(user);
      await user.save();
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }

      throw new AuthenticationError('Not authenticated');
    },
    // addCourse: async (parent, { name, description, price, category, instructorId }) => {
    //   const course = new Course({ name, description, price, category, instructor: instructorId });
    //   await course.save();
    //   return course;

    addCourse: async (parent, { name, description, price, category, instructorId }) => {
      const course = new Course({ name, description, price, category, instructor: instructorId });
      await course.save();
    
      // Update the instructor's user document to include the new course
      await User.findByIdAndUpdate(instructorId, { $push: { courses: course._id } });
    
      return course;
    },

publishCourse: async (_, { courseId }) => {
  const course = await Course.findByIdAndUpdate(courseId, { published: true }, { new: true });
  return course;
},

unpublishCourse: async (_, { courseId }) => {
  const course = await Course.findByIdAndUpdate(courseId, { published: false }, { new: true });
  return course;

    },

    addLesson: async (parent, { courseId, title, content, video, free_preview }) => {
      const course = await Course.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      course.lessons.push({ title, content, video, free_preview });
      await course.save();
      return course;
    },
    markLessonCompleted: async (parent, { courseId, lessonId, userId }) => {
      const completed = new Completed({ course: courseId, user: userId });
      completed.lessons.push(lessonId);
      await completed.save();
      return completed;
    },

    updateLesson: async (parent, { courseId, lessonId, title, content, video, free_preview }) => {
      const course = await Course.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }
      const lesson = course.lessons.id(lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }
      lesson.title = title;
      lesson.content = content;
      lesson.video = video;
      lesson.free_preview = free_preview;
      await course.save();
      return course;
    },

    deleteLesson: async (parent, { courseId, lessonId }) => {

      const course = await Course.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }   
      const lesson = course.lessons.id(lessonId);
      if (!lesson) {
        throw new Error('Lesson not found');
      }
      lesson.remove();
      await course.save();
      return course;
    },
    


    createStripeAccount: async (_, args, { user }) => {
      if (!user) {
        throw new Error('Authentication required');
      }

      const existingUser = await User.findById(user._id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      let stripeAccountId = existingUser.stripe_account_id; // Ensure this field name matches your User model
      if (!stripeAccountId) {
        const stripeAccount = await stripe.accounts.create({
          type: 'express',
          email: existingUser.email,
        });
        stripeAccountId = stripeAccount.id;

        existingUser.stripe_account_id = stripeAccountId;
        await existingUser.save();
      }

      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding',
      });

      return {
        url: accountLink.url,
        email: existingUser.email,
      };
    },


handleStripeCallback: async (_, args, { user }) => {
  console.log("HandleStripeCallback invoked");

  if (!user) {
    throw new Error('Authentication required');
  }

  console.log("User ID:", user._id);
  const existingUser = await User.findById(user._id);
  
  if (!existingUser) {
    throw new Error('User not found');
  }

  console.log("Existing user roles:", existingUser.role);
  console.log("Existing Stripe account ID:", existingUser.stripe_account_id);

  if (!existingUser.stripe_account_id) {
    throw new Error('Stripe onboarding not completed');
  }

  if (!existingUser.role.includes('instructor')) {
    existingUser.role.push('instructor');
    existingUser.markModified('role');
    await existingUser.save();
    console.log("Updated user roles:", existingUser.role);
  }

  return existingUser;
},
confirmUpload: async (_, { courseId, imageUrl }) => {
  // Implement logic to update the course with the new image URL
  try {
    // Example: Update the course's image URL in the database
    await Course.findByIdAndUpdate(courseId, { image: imageUrl }, { new: true });

    // Return true to indicate success
    return true;
  } catch (error) {
    console.error("Error in confirmUpload mutation:", error);
    throw new Error("Failed to confirm upload");
  }
},

removeImage: async (_, { imageUrl }) => {
  try {
    const Key = imageUrl.split('/').pop(); // Extract filename from URL

    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `images/${Key}`,
    }).promise();

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
},

enrollInCourse: async (_, { courseId }, { user }) => {
  if (!user) {
    throw new AuthenticationError('You must be logged in to enroll in a course');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  // Check if the user is already enrolled
  const existingEnrollment = await Completed.findOne({ user: user._id, course: courseId });
  if (existingEnrollment) {
    return { success: false, message: 'User is already enrolled in this course' };
  }

  // Create a new enrollment (Completed) entry
  const newEnrollment = new Completed({
    user: user._id,
    course: courseId,
    lessons: [] // Initialize with empty array, to be updated as the user progresses
  });

  await newEnrollment.save();

  return { success: true, message: 'Enrollment successful' };
},

 
checkEnrollment: async (_, { courseId }) => {
  // Check if any user is enrolled in the course
  const isEnrolled = await Completed.exists({ course: courseId });

  return { status: isEnrolled };
},

      
  },
};

module.exports = resolvers;
