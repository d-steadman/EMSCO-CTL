import { useCallback, useRef, useState } from "react";
import { getColDefs } from "./CTL";

export default function Login({ loggedIn, setLoggedIn, gridRef }) {
  const inputRef = useRef();

  const handleLogin = useCallback(() => {
    fetch("/api/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ password: inputRef.current.value }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.message) {
          alert(json.message);
        } else {
          sessionStorage.setItem("jwt", json.token);
          setLoggedIn(true);
          gridRef.current.api.setGridOption("columnDefs", getColDefs(true));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return loggedIn ? (
    <div className="flex-1">
      <span className="btn bg-green-600 text-white text-xl">Logged In</span>
    </div>
  ) : (
    <div className="flex flex-1 m-0">
      <input
        ref={inputRef}
        name="password"
        type="password"
        className="px-2.5 py-1.5 rounded-l-full border text-xl"
        placeholder="Password"
      />
      <button
        className="px-2.5 py-1.5 bg-black text-xl text-white font-semibold border border-black rounded-r-full"
        type="submit"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}
