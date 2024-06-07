import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="navbar bg-base-100 mb-8">
      <Link href="/" className="btn btn-ghost text-xl">
        Geodle
      </Link>
    </div>
  );
};

export default Header;
