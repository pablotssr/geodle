import React from "react";

const Loader = () => {
  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    </>
  );
};

export default Loader;
