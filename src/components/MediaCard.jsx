import { useState } from "react";
import Modal from "@mui/material/Modal";

const MediaCard = ({ thumbnailImg, videoURL, value }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <div className="relative" onClick={handleOpen}>
        <img src={thumbnailImg} className="max-w-[200px] rounded-xl mb-2" />
        <PlayCircleIcon className="text-white/80 bg-blue-500 w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
      </div>
      <span className="text-left text-[14px]">{value}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="ModalVideo"
      >
        <video
          src={videoURL}
          autoPlay="false"
          controls
          className="w-[90%] h-auto"
        />
      </Modal>
    </>
  );
};

export default MediaCard;
