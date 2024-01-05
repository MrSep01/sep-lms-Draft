import { Select, Button, Avatar, Badge } from "antd";
const { Option } = Select;

const CourseCreateForm = ({
  handleSubmit,
  handleImageUpload,
  handleImageRemove,
  handleChange,
  values,
  setValues,
  imagePreview
}) => {

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input type="text" name="name" className="form-control" placeholder="Course Name" value={values.name} onChange={handleChange} />
      </div>

      <div className="form-group">
        <textarea name="description" cols="7" rows="7" value={values.description} className="form-control" onChange={handleChange}></textarea>
      </div>

      <div className="form-group">
        <Select style={{ width: "100%" }} size="large" value={values.paid ? 'Paid' : 'Free'} onChange={(v) => setValues({ ...values, paid: v === 'Paid' })}>
          <Option value="Paid">Paid</Option>
          <Option value="Free">Free</Option>
        </Select>
      </div>

      {values.paid && (
        <div className="form-group">
          <input type="number" name="price" className="form-control" placeholder="Price" value={values.price} onChange={handleChange} />
        </div>
      )}

      <div className="form-group">
        <input type="text" name="category" className="form-control" placeholder="Category" value={values.category} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label className="btn btn-outline-secondary">
          {values.image ? 'Change Image' : 'Upload Image'}
          <input type="file" name="image" hidden onChange={handleImageUpload} />
        </label>
        {imagePreview && (
          <Badge count="X" onClick={handleImageRemove} className="pointer">
            <Avatar src={imagePreview} size={200} />
          </Badge>
        )}
      </div>

      <Button onClick={handleSubmit} type="primary" size="large" shape="round" disabled={values.uploading}>
        {values.uploading ? "Uploading..." : "Create Course"}
      </Button>
    </form>
  );
};

export default CourseCreateForm;

