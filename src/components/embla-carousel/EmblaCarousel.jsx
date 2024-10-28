/* eslint-disable react/prop-types */
import React from "react";
import { useDotButton } from "./hooks/useDotButton";
import { usePrevNextButtons } from "./hooks/usePrevNextButtons";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import "./embla.css";
import { cn } from "@/lib/utils";
import { ArrowIcon } from "@/assets/icons";

const EmblaCarousel = (props) => {
	const { slides, options = {} } = props;
	const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

	const onNavButtonClick = React.useCallback((emblaApi) => {
		const autoplay = emblaApi?.plugins()?.autoplay;
		if (!autoplay) return;
		// remove pause on interaction
		const resetOrStop =
			autoplay.options.stopOnInteraction === false
				? autoplay.reset
				: autoplay.stop;

		resetOrStop();
	}, []);

	const { selectedIndex, onDotButtonClick } = useDotButton(
		emblaApi,
		onNavButtonClick
	);

	const {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick,
	} = usePrevNextButtons(emblaApi, onNavButtonClick);

	return (
		<section className="embla">
			<div className="embla__viewport my-10" ref={emblaRef}>
				<div className="embla__container">
					{slides.map((slide, index) => (
						<div
							className="embla__slide"
							key={index}
							onClick={() => onDotButtonClick(index)}
							onKeyDown={() => onDotButtonClick(index)}
						>
							<div className="embla__slide__number bg-white flex flex-col md:gap-3 p-6 md:p-8">
								<span className="font-bold text-2xl md:text-4xl">“</span>
								<p
									className={cn(
										"font-medium text-sm sm:text-lg w-full md:w-[85%]"
									)}
								>
									{slide.review}
								</p>
								<div className="flex items-center gap-3 mt-auto">
									<div className="w-12 aspect-square rounded-full bg-blue-500 overflow-hidden">
										<img
											src={slide.imgUrl}
											alt="profile"
											className=" h-full w-full object-cover "
										/>
									</div>
									<div className="md:space-y-1">
										<h3 className="font-semibold ">{slide.name}</h3>
										<p className="font-medium text-[#606060]">Traveler</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="flex gap-5 justify-between">
				<div className="space-x-2">
					<button
						type="button"
						onClick={onPrevButtonClick}
						disabled={prevBtnDisabled}
						className="w-9 h-9 rounded-full bg-blue-500 text-white disabled:bg-white disabled:text-black font-bold text-xl inline-flex items-center justify-center ml-auto transition duration-150 ease-in-out"
					>
						<span className="rotate-180">
							<ArrowIcon />
						</span>
					</button>
					<button
						type="button"
						onClick={onNextButtonClick}
						disabled={nextBtnDisabled}
						className="w-9 h-9 rounded-full bg-blue-500 text-white disabled:bg-white disabled:text-black font-bold text-xl inline-flex items-center justify-center transition duration-150 ease-in-out"
					>
						<span>
							<ArrowIcon />
						</span>
					</button>
				</div>
				<div className="flex items-center gap-2">
					{Array.from({ length: slides.length }).map((_, index) => (
						<button
							type="button"
							data-state={selectedIndex === index ? "active" : ""}
							key={index}
							onClick={() => onDotButtonClick(index)}
							className="w-2 h-2 bg-white shadow-sm rounded-full data-[state=active]:bg-black"
						/>
					))}
				</div>
			</div>
		</section>
	);
};

export default EmblaCarousel;
