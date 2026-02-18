import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const RollBackButton = ({ to = -1, label = "Back", fixed = true }) => {
    const navigate = useNavigate();
    return (
        <button
            className={`${fixed ? "fixed top-6 left-4" : ""} z-999 flex items-center gap-2 bg-white/80 hover:bg-white text-gray-800 px-4 py-2 rounded-full shadow-md transition backdrop-blur-sm `}
            onClick={() => navigate(to)}
        >
            <FaArrowLeft />
            <span>{label}</span>
        </button>
    );
}
export default RollBackButton;