import "./styles.css";
import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const images = [
  "https://i.ibb.co/s2PKJm4/hero.jpg",
  "https://i.ibb.co/S5HbzhB/hero-2.png",
  "https://i.ibb.co/LQZhSyy/hero-3.png
  ",
];

export default function FadeInBackgroundTransition() {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <TransitionGroup className="fade-image-container absolute top-0 left-0">
      <CSSTransition
        key={images[currentImageIndex]}
        timeout={1000} // Duration of the fade transition
        classNames="fade"
      >
        <div
          className="fade-image"
          style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
        />
      </CSSTransition>
    </TransitionGroup>
  );
}
