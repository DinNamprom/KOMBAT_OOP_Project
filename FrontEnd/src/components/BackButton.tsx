import backBtnImage from "../assets/back-button.svg";

interface BackButton {
    onClick?: () => void;
}

const BackButton = ({ onClick }: BackButton) => {
    return(
        <button
            onClick={(onClick)}
            className="absolute top-8 left-8 bg-transparent border-none p-0 cursor-pointer transition-transform hover:scale-105 active:scale-95"
        >
            <img
                src={backBtnImage}
                alt="Back"
                className="w-30 md:w-40 h-auto"
            />
        </button>
    );
};
export default BackButton;
