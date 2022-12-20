import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { FaCat } from "react-icons/fa";

function Control() {
  const [rndNum, setRndNum] = useState(101);
  const [numbers, setNumbers] = useState([]);
  const [isRnd, setIsRnd] = useState(false);
  const showNum = useSpring({
    from: { val: 0 },
    to: { val: rndNum },
    config: {
      friction: 240,
      tension: 200,
      duration: 2000,
    },
  });

  function firstRandom() {
    setRndNum(randomNumber());
  }

  function handleOnRandomClick() {
    if (isRnd) return;

    if (numbers.length === 100) {
      alert("Randomized 100 numbers!");
      return;
    }
    setNumbers([...numbers, rndNum]);

    let num;
    do {
      num = randomNumber();
    } while (numbers.includes(num));
    setRndNum(num);
    setIsRnd(true);
    setTimeout(() => {
      setIsRnd(false);
    }, 2000);
  }

  function resetNumber() {
    setNumbers(() => []);
  }

  return (
    <div className="text-center text-xl flex flex-col gap-y-8 max-w-4xl justify-center items-center h-screen mx-auto">
      <FaCat />
      <div className="text-9xl font-bold ">
        {rndNum !== 101 ? (
          <animated.div
            className={`${
              isRnd
                ? "text-black animate-none transition-all ease-in-out duration-700"
                : "animate-bounce text-red-300 transition-all ease-in-out duration-700"
            }`}
          >
            {showNum.val.to((val) => Math.floor(val))}
          </animated.div>
        ) : (
          <div>-</div>
        )}
      </div>
      <Button
        className="hover:bg-black/10"
        onClick={rndNum !== 101 ? handleOnRandomClick : firstRandom}
        label="Random Number"
      />
      <div className="font-bold">Randomized Number:</div>
      <div className="max-w-2xl overflow-ellipsis h-36 leading-loose">
        {numbers.length
          ? numbers.map((number, index) => (index ? ", " : "") + number)
          : "None"}
      </div>
      <Button
        className="hover:bg-red-200/90"
        onClick={resetNumber}
        label="Reset Number"
      />
    </div>
  );
}

const Button = ({ className, onClick, label }) => (
  <button
    className={`border-2 px-6 py-3 rounded-lg shadow-md focus:ring-0 focus:outline-none hover:bg-black/10 ${className}`}
    onClick={onClick}
  >
    {label}
  </button>
);

function randomNumber() {
  return Math.floor(Math.random() * 100);
}

export default Control;
