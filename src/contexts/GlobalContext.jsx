import React from "react";
import PropTypes from "prop-types";
import BookingContext from "./BookingContext";

export const GlobalCTX = React.createContext();

const adminStore = JSON.parse(localStorage.getItem("admin")) ?? {};
const GlobalContext = ({ children }) => {
	const contact = React.useRef();
	const faq = React.useRef();
	const services = React.useRef();
	const [loading, setLoading] = React.useState(false);
	const [adminProfile, setAdminProfile] = React.useState(adminStore);
	const [showModal, setShowModal] = React.useState(false);
	const [modalContent, setModalContent] = React.useState();
	const { live, setLive } = React.useState(false);

	React.useEffect(() => {
		if (Object.keys(adminProfile).length)
			localStorage.setItem("admin", JSON.stringify(adminProfile));
	}, [adminProfile]);

	const mountPortalModal = (modalContent) => {
		if (!showModal) {
			setShowModal(true);
			setModalContent(modalContent);
		}
	};

	const unMountPortalModal = () => {
		if (showModal) {
			setShowModal(false);
			setModalContent();
		}
	};

	const scrollToSection = (e) => {
		window.scrollTo({
			top: e.current.offsetTop - 70,
			behavior: "smooth",
		});
	};

	const ctxValues = {
		contact,
		faq,
		services,
		scrollToSection,
		loading,
		setLoading,
		adminProfile,
		setAdminProfile,
		showModal,
		setShowModal,
		modalContent,
		setModalContent,
		mountPortalModal,
		unMountPortalModal,
		live,
	};

	return (
		<GlobalCTX.Provider value={ctxValues}>
			<BookingContext>{children}</BookingContext>
		</GlobalCTX.Provider>
	);
};

GlobalContext.propTypes = {
	children: PropTypes.node,
};

export default GlobalContext;
