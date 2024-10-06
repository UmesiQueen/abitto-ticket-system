import React from "react";
import PropTypes from "prop-types";
import BookingContext from "./BookingContext";
import Cookies from 'js-cookie';

export const GlobalCTX = React.createContext();

const adminStore = JSON.parse(localStorage.getItem("admin")) ?? {};
const GlobalContext = ({ children }) => {
	const contact = React.useRef();
	const faq = React.useRef();
	const services = React.useRef();
	const terminals = React.useRef();
	const [loading, setLoading] = React.useState(false);
	const [adminProfile, setAdminProfile] = React.useState(adminStore);
	const [showModal, setShowModal] = React.useState(false);
	const [modalContent, setModalContent] = React.useState();
	const [liveMessage, setLiveMessage] = React.useState({});
	const [showLiveModal, setShowLiveModal] = React.useState(false);
	const [currentFeedback, setCurrentFeedback] = React.useState({});

	const access_token = Cookies.get('access_token');
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (!access_token) localStorage.removeItem("admin")
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	React.useEffect(() => {
		if (Object.keys(adminProfile).length)
			localStorage.setItem("admin", JSON.stringify(adminProfile));
	}, [adminProfile]);

	React.useEffect(() => {
		if (Object.keys(liveMessage).length)
			setShowLiveModal(true)
	}, [liveMessage])

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
		terminals,
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
		liveMessage,
		setLiveMessage,
		showLiveModal,
		setShowLiveModal,
		currentFeedback,
		setCurrentFeedback,
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
