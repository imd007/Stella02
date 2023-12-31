import { useEffect, useState } from "react";
import { Button, Checkbox, TextField } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import Image from "next/image";
import backgroundImg from "../../public/bg.png";
import backgroundImg2 from "../../public/bg-2.png";
import Link from "next/link";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import enUs from "rmc-date-picker/lib/locale/en_US";
import DatePicker from "rmc-date-picker";
import "rmc-picker/assets/index.css";
import "rmc-date-picker/assets/index.css";
import OtpInput from "react-otp-input";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
// #region unreal render imports
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
// import ReactQuill from 'react-quill';
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import AudioPlayer from "@/components/AudioPlayer";
import VideoPlayer from "@/components/VideoPlayer";
import { MicListen } from "@/components/MicListen";
const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});
const checkedIcon = (
  <svg
    width="36"
    height="37"
    viewBox="0 0 36 37"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 15.2656L18 18.2656L28 8.26562"
      stroke="#7A43C8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <g filter="url(#filter0_d_612_4178)">
      <path
        d="M27 16.2656V23.2656C27 23.7961 26.7893 24.3048 26.4142 24.6798C26.0391 25.0549 25.5304 25.2656 25 25.2656H11C10.4696 25.2656 9.96086 25.0549 9.58579 24.6798C9.21071 24.3048 9 23.7961 9 23.2656V9.26562C9 8.73519 9.21071 8.22648 9.58579 7.85141C9.96086 7.47634 10.4696 7.26562 11 7.26562H22"
        stroke="#8654CE"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        shapeRendering="crispEdges"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_612_4178"
        x="0"
        y="0.265625"
        width="36"
        height="36"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="4" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.533333 0 0 0 0 0.333333 0 0 0 0 0.807843 0 0 0 0.6 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_612_4178"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_612_4178"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

function Home() {
  const [isBrowser, setIsBrowser] = useState(false);
  useEffect(() => {
    if (typeof document !== "undefined") {
      console.log(document.location.href);
      setIsBrowser(true);
    }
  }, []);
  const navigate = useRouter();
  const [terms_accepted, set_terms_accepted] = useState(false);

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [value, setValue] = useState();
  const [textAreavalue, setTextAreavalue] = useState("");
  const [date, setDate] = useState(new Date());
  const [enabelStep4, setEnableStep4] = useState(false);
  const [enabelStep5, setEnableStep5] = useState(false);

  const [languages, setLanguages] = useState([
    { label: "English", value: "ën", checked: false },
    { label: "Hindi", value: "hind", checked: false },
    { label: "Telugu", value: "hind", checked: false },
    { label: "Tamil", value: "hind", checked: false },
    { label: "English", value: "ën", checked: false },
    { label: "Hindi", value: "hind", checked: false },
    { label: "Telugu", value: "hind", checked: false },
    { label: "Tamil", value: "hind", checked: false },
    { label: "English", value: "ën", checked: false },
    { label: "Hindi", value: "hind", checked: false },
    { label: "Telugu", value: "hind", checked: false },
    { label: "Tamil", value: "hind", checked: false },
  ]);

  const modules = {
    toolbar: [
      // [{ header: '1' }, { header: '2' }, { font: [] }],
      // [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
    ],
    clipboard: {
      matchVisual: true,
    },
  };
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  const onLangselect = (index) => {
    console.log(index);
    const temp = [...languages]?.map((o, ind) => {
      if (ind === index) {
        o.checked = !o?.checked;
      }
      return o;
    });
    setEnableStep4(
      temp?.filter((o) => o?.checked == true)?.length ? true : false
    );
    setLanguages(() => [...temp]);
    console.log(temp);
  };

  const [btnOpts, setBtnOpts] = useState([
    { label: "Almost never", value: "ën", checked: false },
    { label: "Few-days", value: "hind", checked: false },
    { label: "Sometimes ", value: "hind", checked: false },
    { label: "Almost everyday", value: "hind", checked: false },
    { label: "Multiple times everydays ", value: "hind", checked: false },
  ]);

  const onBtnselect = (index) => {
    console.log(index);
    const temp = [...btnOpts]?.map((o, ind) => {
      if (ind === index) {
        o.checked = !o?.checked;
      }
      return o;
    });
    setEnableStep5(
      temp?.filter((o) => o?.checked == true)?.length ? true : false
    );
    setBtnOpts(() => [...temp]);
    console.log(temp);
  };

  const handeldateChange = (value) => {
    setDate(value);
  };

  return (
    <div className="w-full ">
      <div className="fixed z-0  w-[100vw] h-[100vh]">
        <Image src={backgroundImg} alt="Img" className="w-[100vw] h-[100vh]" />
        {/* <iframe
          src="http://35.183.155.167/"
          style={{ width: "100vw", height: "100vh", zIndex: -1 }}
          title="W3Schools Free Online Web Tutorials"
        ></iframe> */}
      </div>
      <div className="absolute w-full h-full z-10">
        <div className="relative h-full w-full flex flex-col justify-center  ">
          <div className="absolute top-0 font-bold text-white flex justify-between w-full p-4">
            <div className="  rounded-full">
              {step > 1 ? (
                <ChevronLeftIcon
                  fontSize="large"
                  style={{ background: "#534F4F", borderRadius: "50%" }}
                  onClick={() => {
                    if (step > 1) {
                      setStep((prev) => prev - 1);
                    }
                  }}
                />
              ) : (
                <></>
              )}
            </div>
            <div className="  rounded-full">
              {(step === 3 && enabelStep4) ||
              (step === 4 && enabelStep5) ||
              true ? (
                <ChevronRightIcon
                  fontSize="large"
                  style={{
                    background:
                      "linear-gradient(197deg, #F17CD0 -51.02%, #6749CD 88.98%)",
                    borderRadius: "50%",
                  }}
                  onClick={() => {
                    if (step == 12) {
                      navigate.push("/call");
                    }
                    setStep((prev) => prev + 1);
                  }}
                />
              ) : (
                // <Link href="/chat">
                //   <ChevronRightIcon
                //     fontSize="large"
                //     style={{
                //       background:
                //         "linear-gradient(197deg, #F17CD0 -51.02%, #6749CD 88.98%)",
                //       borderRadius: "50%",
                //     }}
                //     onClick={() => {
                //       setStep((prev) => prev + 1)
                //     }}
                //   />
                // </Link>
                <></>
              )}
            </div>
          </div>
          <div className="w-full h-[150px] justify-self-center self-center grid items-center justify-center px-4">
            <div
              className={
                "p-4 rounded-xl grid gap-4 min-w-[90vw] max-w-[95vw] shadow-xl"
              }
              style={{
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(15px)",
                color: "#000",
                fontFamily: "Poppins",
                textAlign: "center",
                position: "relative",
                overflowX: "hidden",
              }}
            >
              {step === 1 ? (
                <div className="Step1">
                  <div className="text-[14px] flex items-center gap-1   ">
                    <div>
                      <Checkbox
                        size="small"
                        style={{ padding: 0 }}
                        color="secondary"
                        value={terms_accepted}
                        onChange={(e, value) => {
                          set_terms_accepted(value);
                        }}
                      />
                    </div>

                    <div className="text-[14px] text-black font-medium">
                      I have read the terms and conditions
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      style={{
                        borderRadius: "20px",
                        minWidth: "150px",
                        fontFamily: "Poppins",
                        fontWeight: "400",
                        background: terms_accepted
                          ? "linear-gradient(197deg, #F17CD0 -51.02%, #6749CD 88.98%)"
                          : "",
                        filter:
                          "drop-shadow(0px 8px 16px rgba(241, 124, 208, 0.10))",
                        textTransform: "none !important",
                      }}
                      disabled={!terms_accepted}
                      onClick={() => {
                        setStep(2);
                      }}
                    >
                      Log In
                    </Button>
                  </div>
                </div>
              ) : step === 2 ? (
                <div className="Step2">
                  <div className=" flex items-center gap-2 justify-center ">
                    <div className="text-[22px] text-black w-ful ">Name</div>
                  </div>
                  <div>
                    <TextField
                      variant="standard"
                      type="text"
                      fullWidth
                      sx={{
                        textAlign: "left",
                      }}
                      InputProps={{
                        style: {
                          fontSize: "24px",
                          borderRadius: "35px",
                          padding: "0 0 0 10px",
                          border: "2px solid rgba(0,0,0,0.2)",
                          borderRight: "none",
                          background: "rgba(255,255,255,0.3)",
                          // height:"70px
                        },
                        disableUnderline: true,
                        endAdornment: (
                          <div
                            id="login_verify_otp"
                            style={{
                              height: "50px",
                              width: "62px",
                              background:
                                "linear-gradient(197deg, #F17CD0 -51.02%, #6749CD 88.98%)",
                              borderRadius: "25px",
                            }}
                            className="flex items-center justify-center text-white"
                            onClick={() => {
                              setStep(3);
                            }}
                          >
                            <ArrowForwardOutlinedIcon size="small" />
                          </div>
                        ),
                      }}
                    />
                  </div>
                </div>
              ) : step === 3 ? (
                <div className="Step3">
                  <div className=" flex items-center gap-2 justify-center ">
                    <div className="text-[14px] text-black leading-1 ">
                      Lorem ipsum dolor sit amet, consectetur Vestibulum quis
                      nulla sit amet purus commodo
                    </div>
                  </div>
                  <div>
                    <TextField
                      variant="standard"
                      type="text"
                      fullWidth
                      InputProps={{
                        inputProps: {
                          style: {
                            textAlign: "left",
                            height: "40px",
                          },
                        },
                        style: {
                          fontSize: "18px",
                          borderRadius: "35px",
                          border: "2px solid rgba(0,0,0,0.2)",
                          textAlign: "left",
                          background: "rgba(255,255,255,0.3)",
                        },
                        disableUnderline: true,
                        startAdornment: (
                          <div
                            id="login_verify_otp"
                            style={{ padding: "0 8px" }}
                            className="flex items-center justify-center text-white"
                            onClick={() => {
                              setStep(3);
                            }}
                          >
                            <MailOutlinedIcon
                              size="small"
                              style={{ color: "#667085" }}
                            />
                          </div>
                        ),
                      }}
                    />
                  </div>
                </div>
              ) : step === 4 ? (
                <div className="Step4">
                  <div className=" flex items-center gap-2 justify-center w-[300px] ">
                    <div className="text-[14px] text-black leading-1 ">
                      Lorem ipsum dolor sit amet, consectetur Vestibulum quis
                      nulla sit amet purus commodo
                    </div>
                  </div>
                  <div className="border border-gray-200 p-2 rounded-full bg-[rgba(255,255,255,0.4)] w-[90%]">
                    <PhoneInput
                      defaultCountry="IN"
                      placeholder="Enter phone number"
                      value={value}
                      style={{
                        width: "85vw",
                      }}
                      onChange={setValue}
                    />
                  </div>
                </div>
              ) : step === 9 ? (
                <div className="Step9">
                  <div className="">
                    <div className="text-[18px] text-black w-full">
                      Lorem ipsum dolor sit amet, consectetur Vestibulum quis
                      nulla sit amet purus commodo
                    </div>
                    <div className=" text-[22px] text-black font-medium w-full ">
                      Select Language
                    </div>
                  </div>
                  <div>
                    <div className="grid gap-4 max-h-[35vh] overflow-y-scroll px-2">
                      {languages &&
                        languages?.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="flex justify-between items-center pb-2 border-b border-[#00000050] "
                              onClick={() => {
                                onLangselect(index);
                              }}
                            >
                              <div
                                style={{
                                  color: "#000",
                                  fontFeatureSettings: "clig off, 'liga' off",
                                  fontFamily: "Poppins",
                                  fontSize: "16px",
                                  fontStyle: "normal",
                                  fontWeight: 400,
                                  lineHeight: "normal",
                                  letterSpacing: "0.025px",
                                }}
                              >
                                {item?.label}
                              </div>
                              <div>{item?.checked ? checkedIcon : ""}</div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              ) : step === 6 ? (
                <div className="Step6">
                  <div className=" flex items-center gap-2 justify-center ">
                    <div className="text-[14px] text-black leading-1 ">
                      Lorem ipsum dolor sit amet, consectetur Vestibulum quis
                      nulla sit amet purus commodo
                    </div>
                  </div>
                  <div>
                    <DatePicker
                      rootNativeProps={{ "data-xx": "yy" }}
                      date={date}
                      onDateChange={handeldateChange}
                      mode="date"
                      minDate={new Date(1900, 1, 1, 0, 0, 0)}
                      locale={enUs}
                      formatMonth={(month, currentDate) => {
                        console.info(month, "--month");
                        switch (month + 1) {
                          case 1: {
                            return "January";
                          }
                          case 2: {
                            return "February";
                          }
                          case 3: {
                            return "March";
                          }
                          case 4: {
                            return "April";
                          }
                          case 5: {
                            return "May";
                          }
                          case 6: {
                            return "June";
                          }
                          case 7: {
                            return "July";
                          }
                          case 8: {
                            return "August";
                          }
                          case 9: {
                            return "September";
                          }
                          case 10: {
                            return "October";
                          }
                          case 11: {
                            return "November";
                          }
                          case 12: {
                            return "December";
                          }
                          default:
                            return "Month";
                        }
                      }}
                      formatDay={(dateNumber, currentDate) => {
                        const dateString = `${dateNumber}`;
                        return dateString;
                      }}
                    />
                  </div>
                </div>
              ) : step === 7 ? (
                <div className="Step7">
                  <div className=" flex items-center gap-2 justify-center ">
                    <div className="text-[14px] text-black leading-1 ">
                      Lorem ipsum dolor sit amet, consectetur Vestibulum quis
                      nulla sit amet purus commodo
                    </div>
                  </div>
                  <div>
                    <TextField
                      variant="standard"
                      type="text"
                      fullWidth
                      InputProps={{
                        inputProps: {
                          style: {
                            textAlign: "left",
                          },
                        },
                        style: {
                          fontSize: "18px",
                          borderRadius: "35px",
                          border: "2px solid rgba(0,0,0,0.2)",
                          textAlign: "left",
                          background: "rgba(255,255,255,0.3)",
                        },
                        disableUnderline: true,
                        startAdornment: (
                          <div
                            id="login_verify_otp"
                            style={{
                              padding: "0 8px",
                              height: "40px",
                              borderRadius: "25px 0 0 25px",
                              background: "rgba(0,0,0,0.03)",
                            }}
                            className="flex items-center justify-center text-[18px] text-black text-gray-700 border-r border-gray-600 mr-1"
                          >
                            http://
                          </div>
                        ),
                      }}
                    />
                  </div>
                </div>
              ) : step === 8 ? (
                <div className="Step8">
                  <div className=" flex items-center gap-2 flex justify-center ">
                    <div className="text-[14px] text-black leading-1 ">
                      Lorem ipsum dolor sit amet, consectetur Vestibulum quis
                      nulla sit amet purus commodo
                    </div>
                  </div>
                  <div>
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      renderSeparator={
                        <span style={{ color: "rgba(255,255,255,0.05)" }}>
                          {" - "}
                        </span>
                      }
                      renderInput={(props) => <input {...props} />}
                      containerStyle={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                      inputStyle={{
                        // background:"blue",
                        height: "40px",
                        width: "40px",
                        borderRadius: "5px",
                      }}
                      isInputNum={true}
                    />
                  </div>
                </div>
              ) : step === 5 ? (
                <div className="Step5">
                  <div className="flex items-center gap-2 justify-center max-w-[300px] break-word">
                    <div className="text-[14px] text-black leading-1 ">
                      Lorem ipsum dolor sit amet, consectetur Vestibulum quis
                      nulla sit amet purus commodo
                    </div>
                  </div>
                  <div className="w-full">
                    {isBrowser ? (
                      <QuillNoSSRWrapper
                        modules={modules}
                        QuillNoSSRWrapper="snow"
                        formats={formats}
                        value={textAreavalue}
                        onChange={setTextAreavalue}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              ) : step === 10 ? (
                <div className="Step10">
                  <div className=" flex items-center gap-2  ">
                    <div className="text-[18px] text-black w-full ">
                      Lorem ipsum dolor sit amet, consectetur Vestibulum quis
                      nulla sit amet purus commodo
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 ">
                      {btnOpts?.map((o, index) => {
                        return (
                          <div
                            key={index}
                            style={{
                              fontFamily: "Poppins",
                              width: "max-content",
                              fontWeight: o?.checked ? "500" : "400",
                              color: o?.checked ? "White" : "#2D2D2D",
                              background: o?.checked
                                ? "linear-gradient(197deg, #F17CD0 -51.02%, #6749CD 88.98%)"
                                : "",
                              filter:
                                "drop-shadow(0px 8px 16px rgba(241, 124, 208, 0.10))",
                              border: o?.checked
                                ? "none"
                                : "1px solid #00000020",
                              textTransform: "none !important",
                            }}
                            className="p-2 shadow flex items-center gap-1 rounded-full text-sm"
                            onClick={() => {
                              onBtnselect(index);
                            }}
                          >
                            {o?.label}
                            {o?.checked ? <CheckIcon /> : <AddIcon />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : step === 11 ? (
                <div className="Step11">
                  <div className=" flex items-center gap-2  ">
                    <div className="text-[18px] text-black w-full ">
                      Lorem ipsum dolor sit amet, consectetur Vestibulum quis
                      nulla sit amet purus commodo
                    </div>
                  </div>
                  <div>
                    <div className="grid gap-2">
                      {btnOpts?.map((o, index) => {
                        return (
                          <div
                            key={index}
                            style={{
                              borderRadius: "20px",
                              minWidth: "150px",
                              fontFamily: "Poppins",
                              fontWeight: o?.checked ? "500" : "400",
                              color: o?.checked ? "White" : "#2D2D2D",
                              background: o?.checked
                                ? "linear-gradient(197deg, #F17CD0 -51.02%, #6749CD 88.98%)"
                                : "",
                              filter:
                                "drop-shadow(0px 8px 16px rgba(241, 124, 208, 0.10))",
                              textTransform: "none !important",
                            }}
                            className="p-2 shadow"
                            onClick={() => {
                              onBtnselect(index);
                            }}
                          >
                            {o?.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : step === 12 ? (
                <div className="Step12">
                  <AudioPlayer
                    url={
                      "https://www.mfiles.co.uk/mp3-downloads/brahms-st-anthony-chorale-theme-two-pianos.mp3"
                    }
                  />
                  <VideoPlayer />
                  <MicListen />
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50 && isOpen) {
        // Scrolling down and offcanvas is open, close the offcanvas
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  const toggleOffcanvas = () => {
    setIsOpen(!isOpen);
  };

  const items = [
    {
      src: "images/ques.png",
      name: "Help",
    },
    {
      src: "images/flower.png",
      name: "Well-being",
    },
    {
      src: "images/coaching.png",
      name: "Coaching",
    },
    {
      src: "images/ques.png",
      name: "Help",
    },
    {
      src: "images/flower.png",
      name: "Well-being",
    },
  ];

  const newData = [
    {
      src: "images/bkt.png",
      srcName: "Avatar Setting",
    },
    {
      src: "images/earth.png",
      srcName: "Languages",
    },
    {
      src: "images/theme.png",
      srcName: "Theme Setting",
    },
    {
      src: "images/ques.png",
      srcName: "Help",
    },
  ];

  return (
    <div>
      <button
        className="border rounded-3xl w-[30%] py-1 bg-gray-300"
        onClick={toggleOffcanvas}
      ></button>
      <div
        className={`dropDownImage fixed bottom-0 left-0 right-0 bg-white transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <button
          className="border rounded-3xl w-[20%] py-1 bg-white"
          onClick={toggleOffcanvas}
        ></button>
        <div className="flex mt-5  gap-4 w-[100%] overflow-x-scroll">
          {items.map((data) => (
            <div className="bgcolor border h-[99px] border-none rounded-2xl min-w-[130px]">
              <img className="m-3 ml-10" src={data.src} />
              <p className="boxText">{data.name}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <hr></hr>
          <div className="py-2 flex  w-[100%] h-[100%]  ">
            <div className="w-[50%] flex justify-evenly gap-2">
              <img src="images/stella.png" />
              <div className="ml-5">
                <p className=" font-bold text-white text-lg font-sans -ml-5">
                  Stella Smith
                </p>
                <p className="text-[#F8F8F8] text-sm font-medium font-sans -ml-16">
                  Female
                </p>
              </div>
            </div>
            <img
              className="w-[5%] h-[30%] ml-36 mt-5"
              src="images/pencil.png"
            />
          </div>
          <hr></hr>
        </div>
        <div className="flex flex-wrap justify-evenly ">
          {newData.map((newItems) => (
            <div className="bgcolor border rounded-xl border-none w-[40%] mt-5 h-12 flex justify-evenly items-center ">
              <img src={newItems.src} />
              <a href="#">
                {" "}
                <p className="boxText">{newItems.srcName}</p>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
