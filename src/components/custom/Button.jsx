import ClipLoader from "react-spinners/ClipLoader";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const Button = ({
  text = "Button",
  loading = false,
  disabled = loading,
  className,
  type = "button",
  onClick,
  variant = "default",
}) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={cn(
        `h-12 max-w-full px-2 font-semibold text-xs md:text-sm transition-all duration-150 ease-in-out  flex justify-center items-center rounded-lg  disabled:pointer-events-none disabled:border-[#C2C2C2] border-2 border-blue-500 tracking-wide ${className}`,
        {
          "bg-blue-500 hover:bg-blue-700 hover:border-blue-700 text-white hover:text-stone-200 disabled:bg-[#C2C2C2] ":
            variant === "default",
          "!bg-transparent hover:border-blue-700 text-blue-500 hover:text-blue-700 hover:bg-blue-50 disabled:text-[#C2C2C2]":
            variant === "outline",
        }
      )}
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
  text: PropTypes.node,
  loading: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  variant: PropTypes.string,
  id: PropTypes.string,
};

export default Button;
