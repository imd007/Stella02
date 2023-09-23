import { useState, useEffect } from "react";
import Webcam from "react-webcam";

const VideoRecorder = ({ startCam }) => {
  const [videoSrc, setVideoSrc] = useState("");
  //const [startCamera, setStartCamera] = useState(false);

  //Code for starting webcam
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        // Check if the component is still mounted before setting the source
        if (stream && setVideoSrc) {
          setVideoSrc(window.URL.createObjectURL(stream));
        }
      } catch (error) {
        console.error("Error accessing video stream:", error);
      }
    };

    if (startCam) {
      //console.log("CALLING CAMERA!!")
      startVideo();
    }

    // Clean up by stopping the video stream when the component unmounts
  }, [startCam]);
  return (
    <>
      {startCam && (
        <Webcam
          audio={false}
          mirrored={true}
          height={12}
          className="webcam z-[90]"
        />
      )}
    </>
  );
};

export default VideoRecorder;
