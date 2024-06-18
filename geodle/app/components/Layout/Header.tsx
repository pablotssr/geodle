"use client";
import Link from "next/link";
import LeaderboardModal from "../Modal/LeaderboardModal";
import TutorialModal from "../Modal/TutorialModal";
import ThemeChanger from "./ThemeChanger";

const Header = () => {
    return (
        <div className="navbar bg-base-100 mb-8 justify-between px-8">
            <Link href="/" className="btn btn-ghost text-xl">
                Geodle
            </Link>
            <div className="flex flex-row gap-2">
                {/* <LeaderboardModal/> */}
                <TutorialModal/>
                <ThemeChanger/>
            </div>
        </div>
    );
};

export default Header;