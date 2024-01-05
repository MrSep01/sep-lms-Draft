import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_COURSE,
} from "../../../utils/queries";
import {
  ADD_LESSON,
  PUBLISH_COURSE,
  UNPUBLISH_COURSE
} from "../../../utils/mutations";
import { Avatar, Tooltip, Button, Modal, List } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
  UserSwitchOutlined
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";

const courseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({ title: "", content: "", video: {} });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload Video");
  const [progress, setProgress] = useState(0);
  const [students, setStudents] = useState(0); // Student count handling logic needed

  const { courseId } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_COURSE, { variables: { courseId: courseId } });

  useEffect(() => {
    if (data && data.course) {
      setCourse(data.course);
    }
  }, [data]);

  const [addLesson] = useMutation(ADD_LESSON, {
    refetchQueries: [{ query: GET_COURSE, variables: { courseId: courseId } }],
    onCompleted: () => {
      toast.success("Lesson added successfully");
      setVisible(false);
      setValues({ title: "", content: "", video: {} });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const [publishCourse] = useMutation(PUBLISH_COURSE, {
    variables: { courseId },
    onCompleted: () => toast.success("Course published successfully"),
    onError: (error) => toast.error(error.message)
  });

  const [unpublishCourse] = useMutation(UNPUBLISH_COURSE, {
    variables: { courseId },
    onCompleted: () => toast.success("Course unpublished successfully"),
    onError: (error) => toast.error(error.message)
  });

  const handleVideoUpload = (/* video upload logic */) => {
    // Handle video upload logic
  };

  const handleVideoRemove = (/* video removal logic */) => {
    // Handle video removal logic
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    
      <div className="container-fluid pt-3">
        {course && (
          <div className="container-fluid pt-1">
            <div className="media pt-2">
              <Avatar size={80} src={course.image ? course.image.Location : "/course.png"} />
              <div className="media-body pl-2">
                <div className="row">
                  <div className="col">
                    <h5 className="mt-2 text-primary">{course.name}</h5>
                    <p style={{ marginTop: "-10px" }}>{course.lessons && course.lessons.length} Lessons</p>
                    <p style={{ marginTop: "-15px", fontSize: "10px" }}>{course.category}</p>
                  </div>
                  <div className="d-flex pt-4">
                    <Tooltip title={`${students} Enrolled`}>
                      <UserSwitchOutlined className="h5 pointer text-info mr-4" />
                    </Tooltip>
                    <Tooltip title="Edit">
                      <EditOutlined onClick={() => navigate(`/instructor/course/edit/${course._id}`)} className="h5 pointer text-warning mr-4" />
                    </Tooltip>
                    {course.lessons && course.lessons.length < 5 ? (
                      <Tooltip title="Min 5 lessons required to publish">
                        <QuestionOutlined className="h5 pointer text-danger" />
                      </Tooltip>
                    ) : course.published ? (
                      <Tooltip title="Unpublish">
                        <CloseOutlined onClick={() => unpublishCourse({ variables: { courseId: course._id }})} className="h5 pointer text-danger" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Publish">
                        <CheckOutlined onClick={() => publishCourse({ variables: { courseId: course._id }})} className="h5 pointer text-success" />
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
                <ReactMarkdown>{course.description}</ReactMarkdown>
              </div>
            </div>
            <div className="row">
              <Button onClick={() => setVisible(true)} className="col-md-6 offset-md-3 text-center" type="primary" shape="round" icon={<UploadOutlined />} size="large">
                Add Lesson
              </Button>
            </div>
            <Modal title="+ Add Lesson" centered open={visible} onCancel={() => setVisible(false)} footer={null}>
              <AddLessonForm values={values} setValues={setValues} handleAddLesson={() => addLesson({ variables: { ...values, courseId } })} uploading={uploading} uploadButtonText={uploadButtonText} progress={progress} />
            </Modal>
            <div className="row pb-5">
              <div className="col lesson-list">
                <h4>{course.lessons && course.lessons.length} Lessons</h4>
                <List itemLayout="horizontal" dataSource={course.lessons} renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta avatar={<Avatar>{index + 1}</Avatar>} title={item.title} />
                  </List.Item>
                )} />
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
};

export default courseView;
