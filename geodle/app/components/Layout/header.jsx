import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="navbar bg-base-100">
      <Link href="/">
        <div className="btn btn-ghost text-xl">Geodle</div>
      </Link>
    </div>
  );
};

export default Header;