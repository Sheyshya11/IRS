
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
 export const notify = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  