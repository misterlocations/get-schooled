import React from "react";

function Turtle({
    color="#000"
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      enableBackground="new 0 0 45.959 45.959"
      version="1.1"
      viewBox="0 0 45.959 45.959"
      xmlSpace="preserve"
      width="200"
      height="200"
    >
      <path
        fill={color}
        d="M45.105 15.176c-2.826-2.239-7.411-4.072-13.918-1.454-1.082-1.193-2.318-2.141-3.661-2.814a9.19 9.19 0 00.748-3.686C28.274 3.234 25.903 0 22.98 0c-2.926 0-5.296 3.234-5.296 7.222 0 1.348.276 2.605.747 3.686-1.341.673-2.578 1.621-3.66 2.814-6.508-2.62-11.093-.786-13.919 1.453a1.564 1.564 0 001.008 2.786c3.197-.076 6.675 1.093 9.289 2.233a21.663 21.663 0 00-.99 6.528c0 3.949 1.032 7.573 2.748 10.453-1.882 2.394-2.531 4.963-2.641 7.146-.034.67.367 1.287.992 1.53a1.562 1.562 0 001.767-.45c1.152-1.377 2.662-2.56 4.219-3.55 1.728 1.146 3.672 1.807 5.737 1.807 2.064 0 4.009-.66 5.736-1.807 1.558.99 3.066 2.173 4.218 3.55a1.564 1.564 0 002.76-1.08c-.108-2.183-.759-4.752-2.641-7.146 1.716-2.88 2.748-6.504 2.748-10.453 0-2.313-.354-4.52-.99-6.528 2.613-1.141 6.092-2.309 9.289-2.234a1.558 1.558 0 001.004-2.784z"
      ></path>
    </svg>
  );
}

export default Turtle;
