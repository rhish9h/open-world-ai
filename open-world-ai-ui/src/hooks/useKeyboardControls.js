// src/hooks/useKeyboardControls.js
import { useState, useEffect } from "react";

function useKeyboardControls() {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    shift: false,
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          setMovement((m) => ({ ...m, forward: true }));
          break;
        case "ArrowDown":
        case "KeyS":
          setMovement((m) => ({ ...m, backward: true }));
          break;
        case "ArrowLeft":
        case "KeyA":
          setMovement((m) => ({ ...m, left: true }));
          break;
        case "ArrowRight":
        case "KeyD":
          setMovement((m) => ({ ...m, right: true }));
          break;
        case "Space":
          setMovement((m) => ({ ...m, jump: true }));
          break;
        case "ShiftLeft":
        case "ShiftRight":
          setMovement((m) => ({ ...m, shift: true }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          setMovement((m) => ({ ...m, forward: false }));
          break;
        case "ArrowDown":
        case "KeyS":
          setMovement((m) => ({ ...m, backward: false }));
          break;
        case "ArrowLeft":
        case "KeyA":
          setMovement((m) => ({ ...m, left: false }));
          break;
        case "ArrowRight":
        case "KeyD":
          setMovement((m) => ({ ...m, right: false }));
          break;
        case "Space":
          setMovement((m) => ({ ...m, jump: false }));
          break;
        case "ShiftLeft":
        case "ShiftRight":
          setMovement((m) => ({ ...m, shift: false }));
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Clean up the event listeners on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return movement;
}

export default useKeyboardControls;
