import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

const DownloadButton = () => {
  return (
    <Link to="https://myapkexchbucket247.s3.eu-west-2.amazonaws.com/app-release-31.apk">
      <div className="download-button text-center" data-tooltip="Size: 20Mb">
        <div className="button-wrapper">
          <div className="text text-dark border rounded">Download</div>
          <span className="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              role="img"
              width="2em"
              height="2em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"
              ></path>
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DownloadButton;
