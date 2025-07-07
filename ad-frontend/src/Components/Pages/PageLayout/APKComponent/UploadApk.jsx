import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { upload_apk } from "../../../../redux/action";
import './style.css'

const UploadApk = () => {
    const dispatch = useDispatch ();
    const [isUploading, setIsUploading] = useState(false);

  // Function to handle file upload
  const handleFileUpload = (event) => {
    setIsUploading(true);

    dispatch (upload_apk({
        data: event.target.files[0],
        callback: (data) =>{
 
        }
    }))

    setTimeout(() => {
      setIsUploading(false);
    }, 3000); // Simulate 3 seconds of upload time
  };


  return (
   <div className="cardBg">
     <div className="upload-container ">
    <div className="d-flex align-items-center justify-content-center h-100">
      <input
        className="form-control form-control-lg"
        id="formFileLg"
        type="file"
        onChange={handleFileUpload}
      />
      {/* Animation during upload */}
      {isUploading && <div className="upload-animation"></div>}
    </div>
  </div>
   </div>
  )
};

export default UploadApk;
