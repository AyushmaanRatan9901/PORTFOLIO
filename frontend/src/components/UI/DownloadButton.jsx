import React from "react";

const Switch = () => {
  return (
    <div className="m-0 box-border flex items-center justify-center p-0 font-sans">
      <label className="switch-label relative flex h-12 w-44 cursor-pointer items-center rounded-full border-2 border-[rgb(91,91,240)] bg-transparent p-[7px] transition-all duration-[400ms] ease-in-out">
        <input type="checkbox" className="switch-input hidden" />

        {/* Action Circle */}
        <span className="switch-circle relative z-10 flex h-[30px] w-[30px] items-center justify-center overflow-hidden rounded-full bg-[rgb(91,91,240)] transition-all duration-[400ms] ease-in-out">
          {/* Download Arrow Icon */}
          <svg
            className="switch-icon absolute left-1/2 top-1/2 w-[20px] h-[20px] -translate-x-1/2 -translate-y-1/2 text-white transition-all duration-[400ms] ease-in-out"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19V5m0 14-4-4m4 4 4-4"
            />
          </svg>
          {/* Stop Square Loader */}
          <div className="switch-square invisible absolute left-1/2 top-1/2 aspect-square w-[14px] -translate-x-1/2 -translate-y-1/2 rounded-[2px] bg-white opacity-0 transition-all duration-[400ms] ease-in-out" />
        </span>

        {/* Dynamic States Label Text */}
        <p className="switch-title absolute right-6 font-bold tracking-wide text-sm uppercase text-[rgb(91,91,240)] transition-all duration-[400ms] ease-in-out">
          Download
        </p>
        <p className="switch-title switch-title--final invisible absolute right-6 font-bold tracking-wide text-sm uppercase text-emerald-600 opacity-0 transition-all duration-[400ms] ease-in-out">
          Done
        </p>
      </label>

      {/* Embedded Animation Processing Sheet */}
      <style>{`
        .switch-label::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: rgb(91, 91, 240);
          width: 6px;
          height: 6px;
          transition: all 0.4s ease;
          border-radius: 100%;
          margin: auto;
          opacity: 0;
          visibility: hidden;
        }

        .switch-circle::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          background-color: #2728ab;
          width: 100%;
          height: 0;
          transition: all 0.4s ease;
        }

        .switch-label:has(.switch-input:checked) {
          width: 64px;
          animation: installed 0.4s ease 3.5s forwards;
        }

        .switch-label:has(.switch-input:checked)::before {
          animation: rotate 3s ease-in-out 0.4s forwards;
        }

        .switch-input:checked + .switch-circle {
          animation:
            pulse 1s forwards,
            circleDelete 0.2s ease 3.5s forwards;
          transform: rotate(180deg);
        }

        .switch-input:checked + .switch-circle::before {
          animation: installing 3s ease-in-out forwards;
        }

        .switch-input:checked + .switch-circle .switch-icon {
          opacity: 0;
          visibility: hidden;
        }

        .switch-input:checked + .switch-circle .switch-square {
          opacity: 1;
          visibility: visible;
        }

        .switch-input:checked ~ .switch-title {
          opacity: 0;
          visibility: hidden;
        }

        .switch-input:checked ~ .switch-title--final {
          animation: showInstalledMessage 0.4s ease 3.5s forwards;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(91, 91, 240, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 14px rgba(91, 91, 240, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(91, 91, 240, 0);
          }
        }

        @keyframes installing {
          from {
            height: 0;
          }
          to {
            height: 100%;
          }
        }

        @keyframes rotate {
          0% {
            transform: rotate(-90deg) translate(28px) rotate(0);
            opacity: 1;
            visibility: visible;
          }
          99% {
            transform: rotate(270deg) translate(28px) rotate(270deg);
            opacity: 1;
            visibility: visible;
          }
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes installed {
          100% {
            width: 140px;
            border-color: rgb(16, 185, 129);
          }
        }

        @keyframes circleDelete {
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes showInstalledMessage {
          100% {
            opacity: 1;
            visibility: visible;
            right: 52px;
          }
        }
      `}</style>
    </div>
  );
};

export default Switch;
