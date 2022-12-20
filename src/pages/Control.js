import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { FaCat } from "react-icons/fa";

function Control() {
  const [rndNum, setRndNum] = useState(101);
  const [numbers, setNumbers] = useState([]);
  const [isRnd, setIsRnd] = useState(false);
  const showNum = useSpring({ val: rndNum, from: { val: 0 } });

  function handleOnRandomClick() {
    if (isRnd) return;

    if (numbers.length === 100) {
      alert("Randomized 100 numbers!");
      return;
    }

    let num;
    do {
      num = randomNumber();
    } while (numbers.includes(num));
    setRndNum(num);
    setIsRnd(true);
    setTimeout(() => {
      setNumbers([...numbers, num]);
      setIsRnd(false);
    }, 1000);
  }

  return (
    <div className="text-center text-xl flex flex-col gap-y-8 max-w-4xl justify-center items-center h-screen mx-auto">
      <FaCat />
      <div className="text-9xl font-bold">
        {rndNum !== 101 ? (
          <animated.div>
            {showNum.val.to((val) => Math.floor(val))}
          </animated.div>
        ) : (
          <div>-</div>
        )}
      </div>
      <button
        className="border-2 px-6 py-3 rounded-lg shadow-md focus:ring-0 focus:outline-none hover:bg-black/10"
        onClick={handleOnRandomClick}
      >
        Random Number
      </button>
      <div className="font-bold">Randomized Number:</div>
      <div className="max-w-2xl overflow-ellipsis h-36 leading-loose">
        {numbers.length
          ? numbers.map((number, index) => (index ? ", " : "") + number)
          : "None"}
      </div>
    </div>
  );
}

function randomNumber() {
  return Math.floor(Math.random() * 100);
}

export default Control;
