import React, { Children, useState } from "react";
import classes from "./ImageSlider.module.css";

const widthSpan = 100;
export default function ImageSlider(props) {
  const [sliderPosition, setsliderPosition] = useState(0);
  const { children } = props;

  const prevSliderHandler = () => {
    let newPosition = sliderPosition;
    if (newPosition > 0) {
      newPosition = newPosition - 1;
    }
    translateFullSlides(newPosition);
    setsliderPosition(newPosition);
  };
  const nextSliderHandler = () => {
    let newPosition = sliderPosition;
    if (newPosition < children.length - 1) {
      newPosition = newPosition + 1;
    }
    translateFullSlides(newPosition);
    setsliderPosition(newPosition);
  };

  const prevClickHandler = () => {
    prevSliderHandler();
  };

  const nextClickHandler = () => {
    nextSliderHandler();
  };

  const translateFullSlides = (newPosition) => {
    let toTranslate = -widthSpan * newPosition;
    for (var i = 0; i < Children.length; i++) {
      let elem = document.getElementById(`carousalitem` + i);
      elem.style.transform = `translateX(` + toTranslate + `%)`;
    }
  };

  const displayItem = Children.map(children, (child, index) => (
    <div className={classes.CarousalItem} id={`carousalitem` + index}>
      {child}
    </div>
  ));
  return (
    <div>
      <div className={classes.Container}>
        <div className={classes.LeftArrow} onClick={prevClickHandler}>
          ❰
        </div>
        <div className={classes.DisplayFrame}>{displayItem}</div>
        <div className={classes.RightArrow} onClick={nextClickHandler}>
          ❱
        </div>
      </div>
    </div>
  );
}
