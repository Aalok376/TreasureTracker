import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const VideoCall = () => {
  const { roomID } = useParams(); // Extract roomID from URL
  const videoContainerRef = useRef(null); // Using useRef to ensure we have the DOM reference

  useEffect(() => {
    if (!roomID) {
      console.error("Room ID is missing or invalid.");
      return;
    }

    const myMeeting = async () => {
      const appID = 1758786594;  // Your ZEGOCLOUD App ID
      const serverSecret = "b25fc39cf0ff76d39c29241507461d5c";  // Your ZEGOCLOUD Server Secret

      // Generate the kit token for the test
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,  // Pass roomID dynamically
        Date.now().toString(),
        "User"  // You can replace this with actual user information
      );

      // Check if the video container element exists
      if (videoContainerRef.current) {
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container: videoContainerRef.current,  // Pass the container element reference
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,  // Video conference mode
          },
        });
      } else {
        console.error("Video container element not found.");
      }
    };

    // Initialize the meeting
    myMeeting();

  }, [roomID]);

  return (
    <div 
      ref={videoContainerRef} 
      id="video-container" 
      style={{ width: "100vw", height: "100vh" }}
    />
  );
};

export default VideoCall;
