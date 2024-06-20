import ClipLoader from "react-spinners/ClipLoader";
import PropTypes from "prop-types";

const Button = ({
  text = "Button",
  loading = false,
  disabled = loading,
  className,
  type = "button",
  onClick,
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={`bg-blue-500 py-3 max-w-full font-semibold text-sm hover:bg-blue-700 hover:text-stone-200 transition-all duration-150 ease-in-out text-white flex justify-center rounded-lg  disabled:pointer-events-none disabled:hover:text-white disabled:bg-[#C2C2C2] ${className}`}
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
  disabled: PropTypes.bool,
};

export default Button;
