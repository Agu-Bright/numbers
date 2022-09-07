import React from "react";

const FileUpload = ({ submit, onChange, name }) => {
  return (
    <>
      <form onSubmit={submit}>
        <div>
          <label>{name}</label>
          <input type="file" onChange={onChange} />
        </div>
        <input type="submit" value="upload" />
      </form>
    </>
  );
};

export default FileUpload;
