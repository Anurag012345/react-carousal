import React, { Children, useState, useEffect } from "react";
import classes from "./ImageSlider.module.css";

const widthSpan = 100.1;
export default function ImageSlider(props) {
  const [sliderPosition, setSliderPosition] = useState(0);
  const { children, infinite } = props;
  const [touchStartPosition, setTouchStartPosition] = useState(0);
  const [touchEndPosition, setTouchEndPosition] = useState(0);
  const [touched, setTouched] = useState(false);
  const [swiped, setSwiped] = useState(false);

  const prevSliderHandler = () => {
    let newPosition = sliderPosition;
    if (newPosition > 0) {
      newPosition = newPosition - 1;
    } else if (infinite) {
      newPosition = children.length - 1;
    }
    translateFullSlides(newPosition);
    setSliderPosition(newPosition);
  };
  const nextSliderHandler = () => {
    let newPosition = sliderPosition;
    if (newPosition < children.length - 1) {
      newPosition = newPosition + 1;
    } else if (infinite) {
      newPosition = 0;
    }
    translateFullSlides(newPosition);
    setSliderPosition(newPosition);
  };

  const prevClickHandler = () => {
    prevSliderHandler();
  };

  const nextClickHandler = () => {
    nextSliderHandler();
  };

  const jumpToSliderHandler = (id) => {
    translateFullSlides(id);
    setSliderPosition(id);
  };

  const keypressHandler = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      prevSliderHandler();
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      nextSliderHandler();
      return;
    }
    if (49 <= event.keyCode && event.keyCode <= 57) {
      const arrayPos = event.keyCode - 49;
      if (arrayPos < children.length) {
        jumpToSliderHandler(arrayPos);
      }
      return;
    }
    if (event.keyCode === 48) {
      if (children.length >= 10) {
        jumpToSliderHandler(9);
      }
    }
  };

  const touchStartHandler = (e) => {
    setTouchStartPosition(e.targetTouches[0].clientX);
    setTouchEndPosition(e.targetTouches[0].clientX);
    setTouched(true);
  };

  const touchMoveHandler = (e) => {
    setTouchEndPosition(e.targetTouches[0].clientX);
    const frameWidth = document.getElementById("DisplayFrame").offsetWidth;
    const translateDist =
      ((touchEndPosition - touchStartPosition) / frameWidth) * 100;
    translatePartialSlides(translateDist);
    if (touched === true) {
      setSwiped(true);
    }
  };

  const touchEndHandler = (e) => {
    if (swiped) {
      if (touchStartPosition - touchEndPosition > 75) {
        nextSliderHandler();
      } else if (touchStartPosition - touchEndPosition < -75) {
        prevSliderHandler();
      } else {
        jumpToSliderHandler(sliderPosition);
      }
    }
    setTouched(false);
    setSwiped(false);
  };

  const translatePartialSlides = (toTranslate) => {
    let currentTranslation = -sliderPosition * widthSpan;
    let totalTranslation = currentTranslation + toTranslate;
    for (var i = 0; i < children.length; i++) {
      let ele = document.getElementById(`carousalitem` + i);
      ele.style.transform = `translateX(` + totalTranslation + `%)`;
    }
  };
  const translateFullSlides = (newPosition) => {
    let toTranslate = -1 * (widthSpan * newPosition);
    for (var i = 0; i < children.length; i++) {
      let elem = document.getElementById(`carousalitem` + i);
      elem.style.transform = `translateX(` + toTranslate + `%)`;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", keypressHandler);
    return () => {
      window.removeEventListener("keydown", keypressHandler);
    };
  });

  const displayItem = Children.map(children, (child, index) => (
    <div className={classes.CarousalItem} id={`carousalitem` + index}>
      {child}
    </div>
  ));

  const positionIndicators = Children.map(children, (child, index) => (
    <div
      className={
        sliderPosition === index
          ? classes.PositionIndicator.concat(" " + classes.CurrentPosition)
          : classes.PositionIndicator
      }
      onClick={() => jumpToSliderHandler(index)}
    ></div>
  ));

  return (
    <div>
      <div className={classes.Container}>
        <div className={classes.LeftArrow} onClick={prevClickHandler}>
          ❰
        </div>
        <div
          className={classes.DisplayFrame}
          id="DisplayFrame"
          onTouchStart={(e) => touchStartHandler(e)}
          onTouchMove={(e) => touchMoveHandler(e)}
          onTouchEnd={(e) => touchEndHandler(e)}
        >
          {displayItem}
        </div>
        <div className={classes.RightArrow} onClick={nextClickHandler}>
          ❱
        </div>
      </div>
      <div className={classes.Navigation}>{positionIndicators}</div>
    </div>
  );
}
