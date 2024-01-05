import React from 'react';
import { Badge, Button } from 'antd';
import ReactPlayer from 'react-player';
import { LoadingOutlined } from '@ant-design/icons';
import myImage from '../../assets/shutterstock.jpg';
import { currencyFormatter } from "../../utils/helpers";

const SingleCourseJumbotron = ({
  course,
  showModal,
  setShowModal,
  preview,
  setPreview,
  enrolled,
  handleEnrollment
}) => {
  const {
    name,
    description,
    instructor,
    updatedAt,
    lessons,
    image,
    price,
    paid,
    category,
  } = course;

  // Function to handle button click
  const handleButtonClick = () => {
    if (!enrolled) {
      handleEnrollment(); // Trigger enrollment mutation
    }
  };

  // Determine button label based on enrollment status
  const buttonLabel = enrolled ? 'Enrolled' : 'Enroll';

  return (
    <div className="jumbotron bg-primary square">
      <div className="row">
        <div className="col-md-8">
          <h1 className="text-light font-weight-bold">{name}</h1>
          <p className="lead">{description && description.substring(0, 160)}...</p>
          <Badge count={category} style={{ backgroundColor: '#03a9f4' }} className="pb-4 mr-2" />
          <p>Created by: {instructor ? `${instructor.firstName} ${instructor.lastName}` : 'Unavailable'}</p>
          <p>Last updated: {updatedAt}</p>
          <h4 className="text-light">
            {paid ? currencyFormatter({ amount: price, currency: 'usd' }) : 'Free'}
          </h4>
        </div>
        <div className="col-md-4">
          {lessons && lessons[0]?.video?.Location ? (
            <div onClick={() => { setPreview(lessons[0].video.Location); setShowModal(!showModal); }}>
              <ReactPlayer url={lessons[0].video.Location} light={image?.Location || myImage} width="100%" height="225px" />
            </div>
          ) : (
            <img src={image?.Location || myImage} alt={name} className="img img-fluid" />
          )}
          <Button
            className="mb-3 mt-3"
            type="danger"
            block
            shape="round"
            icon={<LoadingOutlined />}
            size="large"
            disabled={enrolled}
            onClick={handleButtonClick}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingleCourseJumbotron;
