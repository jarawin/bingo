import React, { useState } from "react";
import { FaCat } from "react-icons/fa";

const DEFAULT_NUM = 101;
const MAX_NUM = 100;
const INTERVAL = 2500;

function Control() {
  const [rndNum, setRndNum] = useState(DEFAULT_NUM);
  const [numbers, setNumbers] = useState([]);
  const [isRnd, setIsRnd] = useState(false);
  const [showNum, setShowNum] = useState(randomNumber());

  function handleOnRandomClick() {
    if (isRnd) return;

    if (numbers.length === MAX_NUM) {
      alert(`Randomized ${MAX_NUM} numbers!`);
      return;
    }

    setIsRnd(true);
    let nextValue;
    do {
      nextValue = randomNumber();
    } while (numbers.includes(nextValue));

    setRndNum(nextValue);

    const random = setInterval(() => {
      setShowNum(randomNumber());
    }, 50);

    setTimeout(() => {
      clearInterval(random);
      setShowNum(nextValue);
      setNumbers(() => [...numbers, nextValue]);
      setIsRnd(false);
    }, INTERVAL);
  }

  function resetNumber() {
    setRndNum(DEFAULT_NUM);
    setNumbers(() => []);
  }

  return (
    <div className="min-h-screen bg-[#fbebe1] flex">
      <main className="text-center text-xl flex flex-col gap-y-8 max-w-4xl justify-center items-center m-auto">
        {/* <FaCat /> */}
        <div
          className={`text-[16rem] font-bold leading-none
${
  isRnd || rndNum === DEFAULT_NUM
    ? "animate-none text-black transition-all duration-500 ease-out"
    : "animate-bounce text-[#cd3357] transition-all duration-500 ease-in"
}`}
        >
          {showNum}
        </div>
        <Button onClick={handleOnRandomClick} label="Random Number" />
        <div className="font-bold text-4xl">Randomized Number:</div>
        <div className="max-w-2xl h-40 text-3xl leading-loose overflow-y-auto">
          {numbers.length
            ? numbers.map((number, index) => (index ? ", " : "") + number)
            : "None"}
        </div>
        <Button onClick={resetNumber} label="Reset Number" />
      </main>
    </div>
  );
}

const Button = ({ onClick, label }) => (
  <button
    className="border-2 px-6 py-3 rounded-lg shadow-md focus:ring-0 focus:outline-none font-bold text-[#113621] hover:border-[#eaa15a] bg-[#fbebe1]"
    onClick={onClick}
  >
    {label}
  </button>
);

function randomNumber() {
  return Math.floor(Math.random() * 100);
}

export default Control;
