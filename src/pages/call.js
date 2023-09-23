"use client";

import { useState, useEffect, useRef } from "react";
import bgImg from "../../public/bg-2.png";
import Image from "next/image";
import { TextField } from "@mui/material";
import {
  ChatBubbleLeftEllipsisIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
  MicrophoneIcon,
  StopIcon,
  SpeakerWaveIcon,
  PaperAirplaneIcon,
  PlayCircleIcon,
  MusicalNoteIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
//import "@/styles/call.css"
import Webcam from "react-webcam";
import Modal from "@mui/material/Modal";
import ReconnectingWebSocket from "reconnecting-websocket";
import { json } from "react-router-dom";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
//import { createSpeechlySpeechRecognition } from '@speechly/speech-recognition-polyfill';
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import VideoRecorder from "@/components/VideoRecorder";

const Clipboard = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_43_524)">
      <g filter="url(#filter0_d_43_524)">
        <circle cx="20.5" cy="20" r="21" fill="url(#paint0_linear_43_524)" />
      </g>
      <path
        d="M30.4383 19.6622L21.2483 28.8522C20.1225 29.9781 18.5955 30.6106 17.0033 30.6106C15.4112 30.6106 13.8842 29.9781 12.7583 28.8522C11.6325 27.7264 11 26.1994 11 24.6072C11 23.015 11.6325 21.4881 12.7583 20.3622L21.9483 11.1722C22.6989 10.4217 23.7169 10 24.7783 10C25.8398 10 26.8578 10.4217 27.6083 11.1722C28.3589 11.9228 28.7806 12.9408 28.7806 14.0022C28.7806 15.0637 28.3589 16.0817 27.6083 16.8322L18.4083 26.0222C18.0331 26.3975 17.5241 26.6083 16.9933 26.6083C16.4626 26.6083 15.9536 26.3975 15.5783 26.0222C15.2031 25.6469 14.9922 25.138 14.9922 24.6072C14.9922 24.0765 15.2031 23.5675 15.5783 23.1922L24.0683 14.7122"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_43_524"
        x="-16.5"
        y="-9"
        width="74"
        height="74"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="8" />
        <feGaussianBlur stdDeviation="8" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.945098 0 0 0 0 0.486275 0 0 0 0 0.815686 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_43_524"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_43_524"
          result="shape"
        />
      </filter>
      <linearGradient
        id="paint0_linear_43_524"
        x1="29.8333"
        y1="-32.5"
        x2="8.47489"
        y2="37.6961"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#F17CD0" />
        <stop offset="1" stop-color="#6749CD" />
      </linearGradient>
      <clipPath id="clip0_43_524">
        <rect width="40" height="40" rx="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function Call() {
  const TYPES = {
    0: "login",
    1: "form",
    2: "open",
  };

  //console.log("Type", TYPES[1])
  const chatHistoryRef = useRef(null);

  const [loading, setloading] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [typingValue, setTypingValue] = useState("");
  const [open, setOpen] = useState(false);
  const [videoURL, setVideoURL] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const [startCamera, setStartCamera] = useState(false);
  const [startRecording, setStartRecording] = useState(false);
  const [audioRequestData, setAudioRequestData] = useState(null);
  const [token, SetToken] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const recorderControls = useAudioRecorder();

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  //Set timeout for 10 secs
  useEffect(() => {
    setTimeout(() => {
      setloading(true);
    }, "10000");
  }, []);

  // Scroll chat box to the bottom
  useEffect(() => {
    scrollChatToBottom();
  }, [chatHistory]);

  //Get Token
  useEffect(() => {
    const requestOptions = {
      method: "POST",
      redirect: "follow",
    };

    fetch("https://socket.mystella.ai/stella/get-token", requestOptions)
      .then((response) => response.json())
      .then((result) => SetToken(result?.token))
      .catch((error) => console.log("error", error));
  }, []);

  const socketRef = useRef(null);

  //Socket connection
  useEffect(() => {
    if (token !== "") {
      if (!socketRef.current) {
        // Create a new WebSocket connection
        socketRef.current = new ReconnectingWebSocket(
          `wss://socket.mystella.ai/ws?authorization=${token}`
        );

        // Event handler for when the connection is opened
        socketRef.current.addEventListener("open", (event) => {
          console.log("WebSocket connection opened:", event);

          // Send a message to the server
          console.log("SENDING..");
          socketRef.current.send(
            JSON.stringify({
              service_id: 50, // service identifier
              message_id: "",
              question_id: "", //question_id
              type: "",
              response: "Hello!", // option_display_name
              time_stamp: "",
              session_id: "",
              user_id: "",
              classify: "User: ",
              responseFrom: "User",
            })
          );
        });

        // Event handler for when a message is received from the server
        socketRef.current.addEventListener("message", (event) => {
          console.log("Message from server:", event.data);
          //socket.send(typingValue);
          setChatHistory((prevData) => [...prevData, JSON.parse(event.data)]);
        });

        // Event handler for when the connection is closed
        socketRef.current.addEventListener("close", (event) => {
          console.log("WebSocket connection closed:", event);
        });
      }

      // Clean up the WebSocket connection when the component is unmounted
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null; // Reset the ref when the component unmounts
        }
      };
    }
  }, [token]); // Empty dependency array ensures this effect runs only once

  //Audio Recording
  useEffect(() => {
    //console.log("CALLED", audioRequestData)
    const sendAudioData = async () => {
      const url = URL.createObjectURL(audioRequestData);

      console.log("Sending audio to server codde...");
      setChatHistory([
        ...chatHistory,
        {
          service_id: 0,
          message_id: "",
          question_id: 10,
          question: "Hey 🙂", // what will be shown in front end
          type: 2, // 0,1,2 0 - login 1- form 2- open ended questions
          data_type: "",
          audio_url: url,
          options: [
            {
              option_id: "",
              option_technical_name: "",
              option_display_name: "",
              sequence: "",
              is_mandatory: "",
            },
          ],
          time_stamp: "",
          session_id: "",
          classify: "User: ",
          user_id: "",
          responseFrom: "User",
        },
      ]);

      const base64String = await convertBlobToBase64(audioRequestData);

      //sendMessageToApi("audio", base64String);
    };

    if (!startRecording && audioRequestData) {
      sendAudioData();
      setAudioRequestData(null);
      setStartRecording(false); // Reset the flag
    }

    return () => {
      setAudioRequestData(null);
      // Perform any cleanup tasks here if needed
      // This function will be executed when the component is unmounted
    };
  }, [audioRequestData, startRecording]);
  const scrollChatToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };

  const handleSend = () => {
    //Code to send to server
    //console.log("socket", socket);
    if (socketRef.current) {
      // Ensure that the socket exists before sending
      socketRef.current.send(
        JSON.stringify({
          service_id: chatHistory[chatHistory.length - 1].service_id, // service identifier
          message_id: "",
          question_id: chatHistory[chatHistory.length - 1].question_id, //question_id
          type: chatHistory[chatHistory.length - 1].type,
          response: typingValue, // option_display_name
          time_stamp: "",
          session_id: "",
          user_id: "",
          classify: "User: ",
          responseFrom: "User",
        })
      );
    }

    setChatHistory((prevData) => [
      ...prevData,
      {
        service_id: chatHistory[chatHistory.length - 1].service_id, // service identifier
        message_id: "",
        question_id: chatHistory[chatHistory.length - 1].question_id, //question_id
        type: chatHistory[chatHistory.length - 1].type,
        response: typingValue, // option_display_name
        time_stamp: "",
        session_id: "",
        user_id: "",
        classify: "User: ",
        responseFrom: "User",
      },
    ]);

    setTypingValue("");
    setShowInput(false);
  };

  const handleFormOptionClick = (option) => {
    console.log("option", option);
    setChatHistory((prevData) => [
      ...prevData,
      {
        service_id: 50, // service identifier
        message_id: "",
        question_id: chatHistory[chatHistory.length - 1].question_id, //question_id
        type: "",
        response: option.option_display_name, // option_display_name
        time_stamp: "",
        session_id: "",
        user_id: "",
        classify: "User: ",
        responseFrom: "User",
      },
    ]);
  };

  const handleOpen = (type, video, audio) => {
    if (type == "video") {
      setVideoURL(video);
    } else {
      setAudioURL(audio);
    }

    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  //console.log("CHAT", chatHistory)

  const handleRecordingStart = () => {
    setStartRecording(true);

    SpeechRecognition.startListening({ continuous: true });
    console.log("listening");
    // recorderControls.startRecording();
  };

  const handleRecordingStop = async () => {
    setStartRecording(false);
    SpeechRecognition.stopListening;
    // recorderControls.stopRecording();
    console.log("Stopped");
  };

  console.log("listening", listening);
  console.log("TRANSCRIPT", transcript);

  return (
    <div className="w-[100vw] h-[100vh] ">
      <div className="absolute z-10 w-[100vw] h-[100vh] iFrame--container">
        {/* <Image src="/bg-2.png" layout="fill" objectFit="cover" quality={100} /> */}
        <iframe
          id="streamIframe"
          src="http://live.mystella.ai/?AutoConnect=true&MatchViewportRes=true&HoveringMouse=true"
          style={{ width: "100vw", height: "100vh", zIndex: -1 }}
          title="Stella"
        ></iframe>
      </div>

      {loading && (
        <div className="">
          <div className="absolute top-[10%] right-4 p-2 z-20">
            {startCamera && (
              <VideoRecorder startCam={startCamera} />
            )}
          </div>
          <div className="flex flex-col absolute bottom-0 content--container z-20 w-full">
            <div
              ref={chatHistoryRef}
              className="p-2 max-h-[300px] overflow-y-scroll relative "
            >
              <div className="flex flex-col gap-1 items-start justify-end w-full">
                {chatHistory?.map((item, i) => {
                  return (
                    <div className="flex items-start rounded-3xl bg-black/30 p-3 text-white gap-2 text-left">
                      {item?.responseFrom == "Stella" ? (
                        <img src="images/stellaChat.png" alt="" />
                      ) : (
                        <img src="images/userChat.png" alt="" />
                      )}

                      <div
                        className={`space-y-3 ${
                          item.media_type == "video" ||
                          item.media_type == "audio"
                            ? "bg-white/20 rounded-2xl p-2 border border-solid border-white/40"
                            : ""
                        }`}
                      >
                        {(item.media_type == "video" ||
                          item.media_type == "audio") &&
                          item.thumbnail_img !== undefined && (
                            <div
                              className="relative"
                              onClick={() =>
                                handleOpen(
                                  item.media_type,
                                  item.video_url,
                                  item.audio_url
                                )
                              }
                            >
                              <img
                                src={item?.thumbnail_img}
                                className="max-w-[200px] rounded-xl mb-2"
                              />
                              <PlayCircleIcon className="text-white/80 bg-blue-500 w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                            </div>
                          )}
                        {item.audio_url && item.thumbnail_img == undefined && (
                          <audio
                            src={item.audio_url}
                            controls={true}
                            className="w-full min-w-[250px]"
                          />
                        )}
                        <span className="text-left text-[14px]">
                          {`${item?.classify}${
                            item.question || item?.response
                          }`}
                        </span>
                        {/* {<p>{TYPES[item.type]}</p>} */}
                        {TYPES[item.type] == "form" &&
                          item?.options?.length > 0 && (
                            <div className="flex flex-wrap gap-2 text-[14px]">
                              {item?.options?.map((opt, i) => (
                                <button
                                  className="bg-white/20 px-3 py-1 rounded-2xl border border-solid border-white/40 backdrop-blur-md text-white"
                                  onClick={() => handleFormOptionClick(opt)}
                                >
                                  {opt.option_display_name}
                                </button>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-[93%]  mx-auto p-2 mb-5">
              <div
                className={`rounded-[44px] h-[64px] bg-[#FFFFFFCC] justify-evenly items-center w-full ${
                  showInput ? "hidden" : "flex"
                }`}
              >
                <div
                  className="w-[60px] cursor-pointer"
                  onClick={() => setStartCamera(!startCamera)}
                >
                  {startCamera ? (
                    <VideoCameraSlashIcon className="h-6 w-6 text-[#9158CE] mx-auto" />
                  ) : (
                    <VideoCameraIcon className="h-6 w-6 text-[#9158CE] mx-auto" />
                  )}
                </div>
                {/* <div className="w-[60px]">
                  <SpeakerWaveIcon className="h-6 w-6 text-[#9158CE] mx-auto" />
                </div> */}
                {/* {!startRecording ? (
                  <div className="w-[60px]" onClick={handleRecordingStart}>
                    <MicrophoneIcon className="h-6 w-6 text-[#9158CE] mx-auto" />
                  </div>
                ) : (
                  <div className="w-[60px]" onClick={handleRecordingStop}>
                    <StopIcon className="h-6 w-6 text-[#9158CE] mx-auto" />
                  </div>
                )} */}
                {/* <div style={{ visibility: "hidden", position: "absolute" }}>
                  <AudioRecorder
                    onRecordingComplete={(blob) => setAudioRequestData(blob)}
                    recorderControls={recorderControls}
                  />
                </div> */}
                <div
                  onMouseDown={handleRecordingStart}
                  onMouseUp={handleRecordingStop}
                  onMouseLeave={handleRecordingStop}
                >
                  <svg
                    width="82"
                    height="82"
                    viewBox="0 0 82 67"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g filter="url(#filter0_d_612_4495)">
                      <circle
                        cx="41"
                        cy="33"
                        r="25"
                        fill="url(#paint0_linear_612_4495)"
                      />
                    </g>
                    <rect
                      x="33"
                      y="28.1997"
                      width="3.2"
                      height="9.6"
                      rx="1.6"
                      fill="white"
                      fill-opacity="0.3"
                    />
                    <rect
                      x="39.3994"
                      y="21"
                      width="3.2"
                      height="24"
                      rx="1.6"
                      fill="white"
                    />
                    <rect
                      x="45.7988"
                      y="25"
                      width="3.2"
                      height="16"
                      rx="1.6"
                      fill="white"
                    />
                    <defs>
                      <filter
                        id="filter0_d_612_4495"
                        x="0"
                        y="0"
                        width="82"
                        height="82"
                        filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB"
                      >
                        <feFlood
                          flood-opacity="0"
                          result="BackgroundImageFix"
                        />
                        <feColorMatrix
                          in="SourceAlpha"
                          type="matrix"
                          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          result="hardAlpha"
                        />
                        <feOffset dy="8" />
                        <feGaussianBlur stdDeviation="8" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix
                          type="matrix"
                          values="0 0 0 0 0.945098 0 0 0 0 0.486275 0 0 0 0 0.815686 0 0 0 0.1 0"
                        />
                        <feBlend
                          mode="normal"
                          in2="BackgroundImageFix"
                          result="effect1_dropShadow_612_4495"
                        />
                        <feBlend
                          mode="normal"
                          in="SourceGraphic"
                          in2="effect1_dropShadow_612_4495"
                          result="shape"
                        />
                      </filter>
                      <linearGradient
                        id="paint0_linear_612_4495"
                        x1="52.1111"
                        y1="-29.5"
                        x2="26.6844"
                        y2="54.0668"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#F17CD0" />
                        <stop offset="1" stop-color="#6749CD" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div
                  className="w-[60px]"
                  onClick={() => {
                    setShowInput(!showInput);
                  }}
                >
                  <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-[#9158CE] mx-auto" />
                </div>
              </div>

              <div
                className={`gap-3 items-center w-full ${
                  !showInput ? "hidden" : "flex"
                }`}
              >
                <TextField
                  value={typingValue}
                  onChange={(e) => setTypingValue(e.target.value)}
                  placeholder="Start Typing"
                  variant="standard"
                  type="text"
                  textAlign="left"
                  fullWidth
                  InputProps={{
                    inputProps: {
                      style: {
                        textAlign: "left",
                      },
                    },
                    style: {
                      color: "White",
                      fontSize: "14px",
                      borderRadius: "35px",
                      padding: "0 0 0 15px",
                      background: "#FFFFFF25",
                      outline: "1px solid white",
                      height: "40px",
                      textAlign: "left",
                    },
                    disableUnderline: true,
                    startAdornment: (
                      <div
                        className="h-[90%] w-auto aspect-square  rounded-full relative cursor-pointer"
                        onClick={() => setShowInput(false)}
                      >
                        <ArrowLeftIcon className="w-5 h-5 text-white absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    ),
                    endAdornment: (
                      <div
                        id="login_verify_otp"
                        style={{
                          height: "50px",
                          width: "62px",

                          borderRadius: "25px",
                        }}
                        className="flex items-center justify-center text-white cursor-pointer"
                        onClick={handleSend}
                      >
                        <PaperAirplaneIcon className="w-5 h-5 text-white" />
                      </div>
                    ),
                  }}
                />
                {/* <Clipboard /> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="ModalVideo"
        >
          <div className=" absolute w-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-2xl">
            {videoURL == "" ? (
              <div className="flex flex-col gap-5 w-full items-center justify-center">
                <MusicalNoteIcon className="mt-4 w-8 h-8 text-blue-600" />
                <audio src={audioURL} controls={true} className="w-full" />
              </div>
            ) : (
              <video
                src={videoURL}
                autoPlay="false"
                controls="true"
                className="w-full h-auto rounded-xl"
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
