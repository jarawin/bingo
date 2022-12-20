import React, { useState, useEffect } from "react";
import { GoPrimitiveDot } from "react-icons/go";
import { IoIosArrowBack } from "react-icons/io";
import { TfiReload } from "react-icons/tfi";
import { useParams } from "react-router-dom";
import { MdBlock } from "react-icons/md";
import { BsAwardFill } from "react-icons/bs";

import { getFirestore, doc, setDoc } from "firebase/firestore";
import firebase from "../firebase";

function Bingo() {
  const [serverId, setServerId] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [spin, setSpin] = useState(false);
  const [ready, setReady] = useState(localStorage.getItem("ready") || false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(
    JSON.parse(localStorage.getItem("modal")) || false
  );
  const bingoArray = ["B", "I", "N", "G", "O"];
  const [bingo, setBingo] = useState(
    JSON.parse(localStorage.getItem("bingo")) || false
  );
  const [board, setBoard] = useState([
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, -1, 14, 15],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25],
  ]);
  const [selected, setSelected] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

  let { id } = useParams();

  useEffect(() => {
    const serverId = localStorage.getItem("serverId");
    const name = localStorage.getItem("name");
    const userId = localStorage.getItem("userId");

    if (userId) {
      setUserId(userId);
    } else {
      setError("Please refresh the page");
      window.location.href = "/";
    }

    if (id || serverId) {
      setServerId(id || serverId);
    } else {
      setError("Please enter a server ID");
      window.location.href = "/";
    }

    if (name) {
      setName(name);
    } else {
      setError("Please enter your name");
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (bingo) {
      setModal(true);
    }
  }, [bingo]);

  const randomUnique = (min, max, n) => {
    let arr = [];
    while (arr.length < n) {
      let r = Math.floor(Math.random() * (max - min + 1)) + min;
      if (arr.indexOf(r) === -1) arr.push(r);
    }
    return arr;
  };

  const checkBingo = () => {
    let row = 0;
    let col = 0;
    let diag = 0;
    let rdiag = 0;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (selected[i][j]) {
          row++;
          col++;
          if (i == j) {
            diag++;
          }
          if (i + j == 4) {
            rdiag++;
          }
        }
      }
      if (row == 5 || col == 5) {
        return true;
      }
      row = 0;
      col = 0;
    }
    if (diag == 5 || rdiag == 5) {
      return true;
    }

    for (let i = 0; i < 5; i++) {
      let count = 0;
      for (let j = 0; j < 5; j++) {
        if (selected[j][i]) {
          count++;
        }
      }
      if (count == 5) {
        return true;
      }
    }

    if (selected[0][0] && selected[0][4] && selected[4][0] && selected[4][4]) {
      return true;
    }

    return false;
  };

  const randomBoard = () => {
    let newBoard = [...board];
    let newSelected = [...selected];
    let randomNums = randomUnique(1, 75, 24);
    let count = 0;
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (i == 2 && j == 2) {
          newBoard[i][j] = -1;
        } else {
          newBoard[i][j] = randomNums[count];
          count++;
        }
        newSelected[i][j] = 0;
      }
    }

    setBoard(newBoard);
    setSelected(newSelected);
    localStorage.setItem("board", JSON.stringify(newBoard));
  };

  const handleClick = (i, j) => {
    if (ready) {
      let newSelected = [...selected];
      newSelected[2][2] = 1;
      newSelected[i][j] = !newSelected[i][j];
      setSelected(newSelected);

      localStorage.setItem("selected", JSON.stringify(newSelected));
      if (checkBingo()) {
        setBingo(true);
      } else {
        setBingo(false);
      }
    } else {
      setError("Please click on the ready button first");
    }
  };

  const randomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-gray-400",
      "bg-orange-500",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  };

  useEffect(() => {
    const colorLocalStorage = localStorage.getItem("color");
    if (colorLocalStorage) {
      document.body.classList.value = colorLocalStorage;
    } else {
      const color = randomColor();
      localStorage.setItem("color", color);
      document.body.classList.value = color;
    }

    let localBoard = localStorage.getItem("board");
    let localSelected = localStorage.getItem("selected");
    if (localBoard) {
      setBoard(JSON.parse(localBoard));
      if (localSelected) {
        setSelected(JSON.parse(localSelected));
      }
    } else {
      randomBoard();
    }
  }, []);

  const handleBack = async () => {
    setUser(userId, false).then(() => {
      window.location.href = "/";
    });
  };

  const setUser = async (userId, active) => {
    const db = getFirestore(firebase);
    await setDoc(doc(db, "users", userId), {
      name,
      serverId,
      active,
    });
  };

  useEffect(() => {
    localStorage.setItem("modal", JSON.stringify(modal));
    localStorage.setItem("bingo", JSON.stringify(bingo));
    localStorage.setItem("ready", ready);
  }, [bingo, modal, ready]);

  return (
    <div className="h-screen w-full ">
      {bingo && modal && (
        <div className="fixed top-0  mx-auto z-50  p-4 overflow-y-auto md:inset-0 h-modal md:h-full">
          <div className="relative w-full h-full max-w-md md:h-auto">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={() => setModal(false)}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
                </svg>
              </button>
              <div className="p-6 text-center">
                <BsAwardFill className="mx-auto mb-4 text-gray-400 w-14 h-14 dark:text-gray-200" />

                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  Congratulations! Please notify the director as soon as
                  possible.
                </h3>

                <button
                  data-modal-toggle="popup-modal"
                  type="button"
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600  mr-2"
                  onClick={() => setModal(false)}
                >
                  No, cancel
                </button>
                <button
                  data-modal-toggle="popup-modal"
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                  onClick={() => setModal(false)}
                >
                  Yes, I'm sure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div
          id="alert-2"
          className="flex p-4 mb-4 bg-red-100 rounded-lg dark:bg-red-200 absolute top-0 right-0 z-50 m-4"
          role="alert"
        >
          <svg
            className="flex-shrink-0 w-5 h-5 text-red-700 dark:text-red-800"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"></path>
          </svg>
          <span className="sr-only">Info</span>
          <div className="ml-3 text-sm font-medium text-red-700 dark:text-red-800">
            {error}
          </div>
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-red-200 dark:text-red-600 dark:hover:bg-red-300"
            data-dismiss-target="#alert-2"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
            </svg>
          </button>
        </div>
      )}
      <div className=" h-1/6">
        <div className="flex justify-between mr-3 pt-2">
          <div className="flex space-x-2">
            <div
              className=" w-fit h-fit flex text-left ml-2 mt-2 bg-white cursor-pointer py-1 pl-2 pr-4 rounded-xl"
              onClick={handleBack}
            >
              <IoIosArrowBack className=" mt-1" />
              <a className="">Back</a>
            </div>

            <button
              className={
                (ready ? "bg-gray-100 cursor-not-allowed" : "bg-white ") +
                " p-2 mt-2 w-fit h-fit rounded-full "
              }
              onClick={() => {
                if (!ready) {
                  setSpin(true);
                  setTimeout(() => {
                    setSpin(false);
                    randomBoard();
                  }, 500);
                }
              }}
            >
              {!ready ? (
                <TfiReload
                  className={(spin ? "animate-spin " : "") + "  w-5 h-5 "}
                />
              ) : (
                <MdBlock className=" w-5 h-5" />
              )}
            </button>
          </div>

          <div className="mt-1">
            <div className="flex justify-start">
              <GoPrimitiveDot className="text-white animate-pulse mt-1" />

              <h1 className="   text-white animate-pulse ">user: {name}</h1>
            </div>
            <div className="flex justify-start">
              <GoPrimitiveDot className="text-white animate-pulse mt-1" />

              <h1 className="   text-white animate-pulse ">
                server: {serverId}
              </h1>
            </div>
          </div>
        </div>
      </div>
      <table className="mx-auto bg-white">
        <tbody>
          <tr>
            {bingoArray.map((letter, i) => {
              return (
                <td
                  className="text-4xl font-bold text-center w-16 h-16 border-2 text-white border-black bg-pink-600"
                  key={i}
                >
                  {letter}
                </td>
              );
            })}
          </tr>
          {board.map((row, i) => {
            return (
              <tr key={i}>
                {row.map((col, j) => {
                  let isFree = i == 2 && j == 2;
                  let isSelected = selected[i][j];
                  let isCorner = (i == 0 && j == 0) || (i == 0 && j == 4);
                  return (
                    <td
                      key={j}
                      className={
                        (isFree
                          ? " bg-yell "
                          : isSelected
                          ? " rounded-full bg-yell "
                          : " bg-white") +
                        (isCorner ? " " : "") +
                        " text-center w-16 h-16 border-2 border-black "
                      }
                      onClick={() => {
                        !isFree
                          ? handleClick(i, j)
                          : console.log("cannot click free");
                      }}
                    >
                      <span
                        className={
                          (isFree ? "text-3xl font-medium" : "text-4xl") +
                          "  cursor-pointer"
                        }
                      >
                        {isFree ? "Free" : col}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        className={
          (ready ? "" : "animate-bounce") + " mt-10 flex justify-center"
        }
      >
        <button
          className={
            (ready ? "bg-indigo-500 " : "bg-orange-500") +
            " px-5 py-3  rounded-2xl text-2xl border-2 border-black "
          }
          onClick={() => {
            setReady(!ready);
          }}
        >
          Click to {ready ? "Unready" : "Ready"}
        </button>
      </div>
    </div>
  );
}

export default Bingo;
