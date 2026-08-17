import React from "react";

const Button = () => {
  return (
    <button className="group relative inline-flex items-center justify-start h-12 w-48 overflow-hidden rounded-full bg-transparent p-0 font-sans text-sm font-bold uppercase tracking-wider outline-none border-0 cursor-pointer select-none">
      {/* Animated Circle Background */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-[#282936] transition-all duration-500 ease-[cubic-bezier(0.65,0,0.076,1)] group-hover:w-full"
      >
        {/* The Arrow Icon Container */}
        <span className="relative left-0 flex h-3 w-5 items-center justify-start transition-all duration-500 ease-[cubic-bezier(0.65,0,0.076,1)] group-hover:translate-x-32">
          {/* Arrow Shaft */}
          <span className="h-[2px] w-4 bg-white transition-colors duration-300" />
          {/* Arrow Head */}
          <span className="absolute right-1 h-2 w-2 rotate-45 border-r-2 border-t-2 border-white" />
        </span>
      </span>

      {/* Button Text */}
      <span className="absolute left-14 pr-4 text-center text-[#282936] transition-all duration-500 ease-[cubic-bezier(0.65,0,0.076,1)] group-hover:left-8 group-hover:text-white">
        View Project
      </span>
    </button>
  );
};

export default Button;
