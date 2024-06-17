"use client";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons/faInfoCircle";
import Link from "next/link";
import { useEffect, useState } from "react";
import { themeChange } from "theme-change";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        const prefersDark =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches;
        const defaultTheme = storedTheme
            ? storedTheme
            : prefersDark
            ? "dark"
            : "light";

        document.documentElement.setAttribute("data-theme", defaultTheme);
        setIsDarkMode(defaultTheme === "dark");
        themeChange(false);
    }, []);

    const toggleTheme = () => {
        const newTheme = isDarkMode ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className="navbar bg-base-100 mb-8 justify-between px-8">
            <Link href="/" className="btn btn-ghost text-xl">
                Geodle
            </Link>
            <div className="flex flex-row gap-4">
                <label htmlFor="info-modal" className="btn btn-circle btn-ghost">
                    <FontAwesomeIcon icon={faInfoCircle} />
                </label>
                <input
                    type="checkbox"
                    id="info-modal"
                    className="modal-toggle"
                />
                <div className="modal" role="dialog">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">How to play?</h3>
                        <label
                            htmlFor="info-modal"
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                        >
                            ✕
                        </label>
                        <div className="flex gap-2 flex-col py-4">
                            <p>Geodle is a French city guessing game. </p>
                            <p>
                                There are 2 different game modes, a Wordle and a
                                Map.
                            </p>
                            <p>
                                All towns are prefectures or sub-prefectures of
                                different French departments.
                            </p>
                        </div>
                    </div>
                    <label className="modal-backdrop" htmlFor="info-modal">
                        Close
                    </label>
                </div>
                <label className="flex cursor-pointer gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                    </svg>
                    <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={toggleTheme}
                        className="toggle theme-controller"
                    />
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </label>
            </div>
        </div>
    );
};

export default Header;
