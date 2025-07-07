import React, { useEffect, useRef, useState } from "react";

const WidgetLMT = ({ raderId }) => {
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [iframeHeight, setIframeHeight] = useState("0px");

  useEffect(() => {
    if (window.iFrameResize && iframeRef.current) {
      window.iFrameResize(
        {
          log: false,
          checkOrigin: false,
          heightCalculationMethod: "max",
          onResized: function (data) {
            setIframeHeight(`${data.height}px`);
          },
        },
        iframeRef.current
      );
    }
  }, [raderId]);

  return (
    <>
      <style>{`
        .iframe-container {
          overflow: hidden;
          transition: height 200ms ease-in-out;
        }
        .live-score-iframe {
          width: 100%;
          border: none;
        }
      `}</style>
      <div
        ref={containerRef}
        className="iframe-container"
        style={{ height: iframeHeight }}
      >
        <iframe
          ref={iframeRef}
          scrolling="no"
          src={`https://lmt.ss8055.com/index?Id=${raderId}`}
          title="Online Sport Live Score"
          marginWidth="0"
          marginHeight="0"
          allowFullScreen
          className="live-score-iframe"
        />
      </div>
    </>
  );
};

export default WidgetLMT;
