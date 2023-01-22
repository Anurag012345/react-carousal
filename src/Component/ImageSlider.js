import React, { Children, useState, useEffect } from "react";
import classes from "./ImageSlider.module.css";

const widthSpan = 100.1;
export default function ImageSlider(props) {
  const [sliderPosition, setSliderPosition] = useState(0);
  const { children, infinite, timer, stopOnManual } = props;
  let interval;
  const [autoAdvance, setAutoAdvance] = useState(timer !== undefined);
  //Touch Touch Handlers
  const [touchStartPosition, setTouchStartPosition] = useState(0);
  const [touchEndPosition, setTouchEndPosition] = useState(0);
  const [touched, setTouched] = useState(false);
  const [swiped, setSwiped] = useState(false);
  //mouse event Handlers
  const [mouseStartPosition, setMouseStartPosition] = useState(0);
  const [mouseEndPosition, setMouseEndPosition] = useState(0);
  const [mouseClicked, setMouseClicked] = useState(false);
  const [mouseSwiped, setMouseSwiped] = useState(false);

  const prevSliderHandler = () => {
    let newPosition = sliderPosition;
    if (newPosition > 0) {
      newPosition = newPosition - 1;
    } else if (infinite) {
      newPosition = children.length - 1 || 0;
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

  const manageTimer = () => {
    clearInterval(interval);
    if (stopOnManual) {
      setAutoAdvance(false);
    }
  };
  const prevClickHandler = () => {
    manageTimer();
    prevSliderHandler();
  };

  const nextClickHandler = () => {
    manageTimer();
    nextSliderHandler();
  };

  const jumpToSliderHandler = (id) => {
    translateFullSlides(id);
    setSliderPosition(id);
  };

  const keypressHandler = (event) => {
    manageTimer();
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

  const speedUpAnimation = () => {
    for (let i = 0; i < (children.length || 1); i++) {
      let elem = document.getElementById(`carousalitem` + i);
      elem.classList.add(classes.FastAnimation);
    }
  };

  const slowDownAnimation = () => {
    for (let i = 0; i < (children.length || 1); i++) {
      let elem = document.getElementById(`carousalitem` + i);
      elem.classList.remove(classes.FastAnimation);
    }
  };

  const touchStartHandler = (e) => {
    manageTimer();
    speedUpAnimation();
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
      slowDownAnimation();
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

  const mouseStartHandler = (e) => {
    manageTimer();
    e.preventDefault();
    speedUpAnimation();
    setMouseStartPosition(e.clientX);
    setMouseEndPosition(e.clientX);
    setMouseClicked(true);
  };

  const mouseMoveHandler = (e) => {
    e.preventDefault();
    var frameWidth = document.getElementById("DisplayFrame").offsetWidth;
    if (mouseClicked === true) {
      setMouseEndPosition(e.clientX);
      let translateDist =
        ((mouseEndPosition - mouseStartPosition) / frameWidth) * 100;
      translatePartialSlides(translateDist);
      setMouseSwiped(true);
    }
  };

  const mouseEndHandler = (e) => {
    slowDownAnimation();
    if (mouseSwiped === true) {
      if (mouseStartPosition - mouseEndPosition > 100) {
        nextSliderHandler();
      } else if (mouseStartPosition - mouseEndPosition < -100) {
        prevSliderHandler();
      } else {
        jumpToSliderHandler(sliderPosition);
      }
    }
    setMouseSwiped(false);
    setMouseClicked(false);
  };

  const translatePartialSlides = (toTranslate) => {
    let currentTranslation = -1 * (sliderPosition * widthSpan);
    let totalTranslation = currentTranslation + toTranslate;
    for (var i = 0; i < (children.length || 1); i++) {
      let elem = document.getElementById(`carousalitem` + i);
      elem.style.transform = `translateX(` + totalTranslation + `%)`;
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
    if (autoAdvance && !mouseClicked && !touched) {
      interval = setInterval(() => {
        nextSliderHandler();
      }, timer);
    }
    return () => {
      window.removeEventListener("keydown", keypressHandler);
      clearInterval(interval);
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
          onMouseDown={(e) => mouseStartHandler(e)}
          onMouseMove={(e) => mouseMoveHandler(e)}
          onMouseUp={(e) => mouseEndHandler(e)}
          onMouseLeave={(e) => mouseEndHandler(e)}
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
