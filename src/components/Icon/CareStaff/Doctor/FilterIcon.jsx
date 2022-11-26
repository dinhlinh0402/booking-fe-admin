import * as React from 'react';

function FilterIcon(props) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.19526 1.19526C1.07024 1.32029 1 1.48986 1 1.66667V3.39067C1.00004 3.56746 1.0703 3.737 1.19533 3.862L5.47133 8.138C5.59637 8.263 5.66663 8.43254 5.66667 8.60933V13L8.33333 10.3333V8.60933C8.33337 8.43254 8.40363 8.263 8.52867 8.138L12.8047 3.862C12.9297 3.737 13 3.56746 13 3.39067V1.66667C13 1.48986 12.9298 1.32029 12.8047 1.19526C12.6797 1.07024 12.5101 1 12.3333 1H1.66667C1.48986 1 1.32029 1.07024 1.19526 1.19526Z"
        stroke="#232325"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default FilterIcon;
