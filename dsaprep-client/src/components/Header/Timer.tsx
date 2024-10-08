import { Container, Group, Text } from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";
// import { BsPause } from "react-icons/bs";
import { IoCloseOutline, IoPauseOutline, IoPlayOutline } from "react-icons/io5";
import { MdOutlineTimer } from "react-icons/md";
import { RiRestartLine } from "react-icons/ri";

const Timer: React.FC = () => {
  const [time, setTime] = useState<number>(0); // Time in seconds
  const [isActive, setIsActive] = useState<boolean>(false); // Timer state (active or paused)
  const [isPaused, setIsPaused] = useState<boolean>(false); // Pause state
  const intervalRef = useRef<number | undefined>(undefined); // Reference for interval ID
  const [timerClosing, setTimerClosing] = useState(false);

  useEffect(() => {
    if (isActive && !isPaused) {
      // Set up the interval to update the timer every second
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      // Clean up the interval if the timer is paused or not active
      clearInterval(intervalRef.current);
    }

    // Clean up the interval on component unmount
    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused]);

  // Handle start button click
  const startTimer = () => {
    setTime(0);
    setIsActive(true);
    setIsPaused(false);
  };

  // Handle pause button click
  const pauseTimer = () => {
    setIsPaused(true);
  };

  // Handle reset button click
  const resetTimer = () => {
    // setIsActive(false);
    setIsPaused(false);
    setTime(0);
  };

  const playTimer = () => {
    setIsPaused(false);
  };

  const closeTimer = () => {
    // setTimerClosing(true);
    // setTimeout(() => {
    setIsActive(false);
    // }, 200);
  };
  // Convert time in seconds to hours, minutes, and seconds
  const seconds = time % 60;
  const minutes = Math.floor((time % 3600) / 60);
  const hours = Math.floor(time / 3600);
  return (
    <>
      {isActive ? (
        <Container
          // className={`animate-open ${timerClosing ? "animate-close" : ""}`}
          className="animate-open"
          p={"xs"}
          bg={"blackColor.4"}
          style={{ borderRadius: "10px" }}
        >
          <Group gap={"xs"}>
            <Text>
              {String(hours).padStart(2, "0")}:
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </Text>
            {isPaused ? (
              <IoPlayOutline
                style={{ cursor: "pointer" }}
                size={"1.2rem"}
                onClick={playTimer}
              />
            ) : (
              <IoPauseOutline
                style={{ cursor: "pointer" }}
                size={"1.2rem"}
                onClick={pauseTimer}
              />
            )}
            <RiRestartLine
              style={{ cursor: "pointer" }}
              size={"1rem"}
              onClick={resetTimer}
            />
            <IoCloseOutline
              size={"1.2rem"}
              style={{ cursor: "pointer" }}
              onClick={closeTimer}
            />
          </Group>
        </Container>
      ) : (
        <MdOutlineTimer
          size={"1.6rem"}
          style={{ cursor: "pointer" }}
          onClick={startTimer}
        />
      )}
    </>
  );
};

export default Timer;
