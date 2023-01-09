const ANIMATION_DELAY = 0.1;
const CUSTOM_CURSOR_OUTER_CIRCLE = document.querySelector("#custom-cursor");
const CUSTOM_CURSOR_INNER_CIRCLE = document.querySelector(
  "#custom-cursor-inner-circle"
);
const CUSTOM_CURSOR_TARGET_OFFSET = 0;

const CUSTOM_CURSOR_TARGETING_CLASS = "cursor-targeting";

const customCursorTargets = ["a", "[data-custom-cursor-target]"];

const initialPosition = {
  x: window.innerWidth / 2 - CUSTOM_CURSOR_OUTER_CIRCLE.clientWidth / 2,
  y: window.innerHeight / 2 - CUSTOM_CURSOR_OUTER_CIRCLE.clientHeight / 2,
};

let target = Object.create(initialPosition);

let finalPosition = Object.create(initialPosition);

window.addEventListener("mousedown", (event) => {
  const clickPath = event.composedPath();

  if (clickPath.length > 0) {
    clickPath[0].click();
  }
});

window.addEventListener("mousemove", (event) => {
  target = {
    x: event.clientX,
    y: event.clientY,
  };
});

function changeCustomCursorPosition() {
  const direction = {
    x: target.x - finalPosition.x,
    y: target.y - finalPosition.y,
  };

  const positionIncrement = {
    x: direction.x * ANIMATION_DELAY,
    y: direction.y * ANIMATION_DELAY,
  };

  finalPosition.x += positionIncrement.x;
  finalPosition.y += positionIncrement.y;

  mapCursorPosition();
  detectCustomCursorTarget();

  window.requestAnimationFrame(changeCustomCursorPosition);
}

function mapCursorPosition() {
  const customCursorBorderWidth = window.getComputedStyle(
    CUSTOM_CURSOR_OUTER_CIRCLE
  ).borderWidth;

  CUSTOM_CURSOR_OUTER_CIRCLE.style.top =
    finalPosition.y - CUSTOM_CURSOR_OUTER_CIRCLE.clientHeight / 2;
  CUSTOM_CURSOR_OUTER_CIRCLE.style.left =
    finalPosition.x - CUSTOM_CURSOR_OUTER_CIRCLE.clientWidth / 2;

  CUSTOM_CURSOR_INNER_CIRCLE.style.top =
    target.y -
    CUSTOM_CURSOR_INNER_CIRCLE.clientHeight / 2 +
    parseInt(customCursorBorderWidth);
  CUSTOM_CURSOR_INNER_CIRCLE.style.left =
    target.x -
    CUSTOM_CURSOR_INNER_CIRCLE.clientWidth / 2 +
    parseInt(customCursorBorderWidth);
}

function detectCustomCursorTarget() {
  let elementTargetingStates = [];

  customCursorTargets.forEach((targetSelector) => {
    const elements = document.querySelectorAll(targetSelector);
    
    elementTargetingStates.push(
      [...elements]
        .map((element) => {
          const elementRect = element.getBoundingClientRect();
          return (
            target.x > elementRect.x - CUSTOM_CURSOR_TARGET_OFFSET &&
            target.x < elementRect.x + elementRect.width + CUSTOM_CURSOR_TARGET_OFFSET &&
            target.y > elementRect.y - CUSTOM_CURSOR_TARGET_OFFSET &&
            target.y < elementRect.y + elementRect.height + CUSTOM_CURSOR_TARGET_OFFSET
          );
        })
        .some((e) => e === true)
    );
  });

  if (elementTargetingStates.some((e) => e === true)) {
    CUSTOM_CURSOR_OUTER_CIRCLE.classList.add(CUSTOM_CURSOR_TARGETING_CLASS);
  }
  
  if (!elementTargetingStates.some((e) => e === true)) {
    CUSTOM_CURSOR_OUTER_CIRCLE.classList.remove(CUSTOM_CURSOR_TARGETING_CLASS);
  }
}

changeCustomCursorPosition();
