import ClipLoader from "react-spinners/ClipLoader";
import PropTypes from "prop-types";

const Button = ({
  text = "Button",
  loading = false,
  className,
  type = "button",
  onClick,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-500 py-3 max-w-full font-semibold text-sm hover:bg-blue-700 transition-all duration-150 ease-in-out text-white flex justify-center ${className}`}
    >
      {loading ? (
        <ClipLoader
          color="#fff"
          loading={loading}
          size={20}
          aria-label="Loading Spinner"
        />
      ) : (
        text
      )}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  loading: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
