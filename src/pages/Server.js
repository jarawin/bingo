import { useEffect, useState } from "react";
import { HiPlay } from "react-icons/hi2";
import { IoGameController } from "react-icons/io5";
import { useParams } from "react-router-dom";

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import firebase from "../firebase";

function Server() {
  const [serverId, setServerId] = useState("");
  const [serverName, setServerName] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  let { id } = useParams();

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  }, [error]);

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

    const serverId = localStorage.getItem("serverId");
    const serverName = localStorage.getItem("serverName");
    if (serverId) {
      setServerId(serverId);
      setRemember(true);
    }
    if (serverName) {
      setServerName(serverName);
      setRemember(true);
    }
  }, []);

  useEffect(() => {
    if (id) {
      setServerId(id);
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem("serverId", serverId || "");
    localStorage.setItem("serverName", serverName || "");
  }, [serverId, serverName]);

  const onJoin = (e) => {
    e.preventDefault();
    setLoading(true);

    const isHasName =
      serverName && serverName.length > 3 && serverName.length < 20;
    const isHasServerId = serverId && serverId.length == 4;

    if (!isHasName) {
      setError("Please enter your server name (4-20 characters)");
      setLoading(false);
      return;
    }

    if (!isHasServerId) {
      setError("Please enter server id (4 characters)");
      setLoading(false);
      return;
    }

    const serverUId = localStorage.getItem("serverUId");

    if (serverUId) {
      setServer(serverUId).then(() => {
        if (remember) {
          localStorage.setItem("lastServerId", serverId);
          localStorage.setItem("lastName", serverName);
          localStorage.setItem("lastServerUId", serverUId);
        } else {
          localStorage.removeItem("lastServerId");
          localStorage.removeItem("lastName");
          localStorage.removeItem("lastServerUId");
        }

        setLoading(false);
        window.location.href = `/bingo/server/${serverId}`;
      });
    } else {
      addServer().then((serverUId) => {
        localStorage.setItem("serverUId", serverUId);

        if (remember) {
          localStorage.setItem("lastServerId", serverId);
          localStorage.setItem("lastName", serverName);
          localStorage.setItem("lastServerUId", serverUId);
        } else {
          localStorage.removeItem("lastServerId");
          localStorage.removeItem("lastName");
          localStorage.removeItem("lastServerUId");
        }

        setLoading(false);
        window.location.href = `/bingo/server/${serverId}`;
      });
    }
  };

  const joinLastServer = () => {
    const lastServerId = localStorage.getItem("lastServerId");
    const lastName = localStorage.getItem("lastName");
    const lastServerUId = localStorage.getItem("lastServerUId");

    console.log(lastServerId, lastName, lastServerUId);

    if (!lastServerId || !lastName || !lastServerUId) {
      setError("We can't remember your last server :(");
    }

    setServerId(lastServerId);
    setServerName(lastName);
  };

  const addServer = async () => {
    const db = getFirestore(firebase);
    const docRef = await addDoc(collection(db, "servers"), {
      serverName,
      serverId,
      active: true,
    });

    return docRef.id;
  };

  const setServer = async (userId) => {
    const db = getFirestore(firebase);
    await setDoc(doc(db, "servers", userId), {
      serverName,
      serverId,
      active: true,
    });
  };

  return (
    <>
      <div className="flex w-screen h-screen min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
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
              <span className="sr-only">Close</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        )}

        <div className="w-full max-w-md space-y-8 ">
          <div>
            <IoGameController className="mx-auto h-12 w-auto text-gray-800" />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-700">
              Server Bingo CS CMU
            </h2>
            <p className="mt-2 text-center text-sm text-gray-700">
              You can{" "}
              <a
                href="/"
                className="font-medium text-gray-700 hover:text-gray-900"
              >
                join a server
              </a>
            </p>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" serverName="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <input
                  serverName="servername"
                  type="servername"
                  autoComplete="servername"
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  placeholder="Server Name"
                  onChange={(e) => {
                    setServerName(e.target.value);
                  }}
                  value={serverName}
                />
              </div>

              <div className="pt-2">
                <input
                  serverName="number"
                  type="number"
                  autoComplete="number"
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-gray-500 sm:text-sm"
                  placeholder="Room Id"
                  onChange={(e) => {
                    setServerId(e.target.value);
                  }}
                  value={serverId}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  serverName="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
                  onChange={(e) => {
                    setRemember(e.target.checked);
                  }}
                  checked={remember}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  onClick={joinLastServer}
                  className=" cursor-pointer font-medium text-gray-600 hover:text-gray-500"
                >
                  Join last server?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={
                  (loading ? "disabled " : "") +
                  " group relative flex w-full justify-center rounded-md border border-transparent bg-gray-600 py-2 px-4 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                }
                onClick={onJoin}
                disabled={loading}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <HiPlay
                    className={
                      (loading ? "animate-spin" : "") +
                      " h-5 w-5 text-gray-300 group-hover:text-white"
                    }
                  />
                </span>
                {loading ? "Loading..." : "Create a Server"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Server;
