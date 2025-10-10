// src/utils/classNames.js
export const boardSize = `
  w-[40vw] h-[40vw]           /* default small screens: fills most width */
  sm:w-[40vw] sm:h-[40vw]     /* small phones */
  md:w-[40vw] md:h-[40vw]     /* tablets */
  lg:w-[40vw] lg:h-[40vw]     /* laptops */
  xl:w-[40vw] xl:h-[40vw]     /* desktops */
  2xl:w-[40vw] 2xl:h-[40vw]   /* very large screens */
  max-w-[960px] max-h-[960px] /* never exceed 960x960 */
  shadow-2xl rounded-md
`;
export const pieceSize = `
  w-[5vw] h-[5vw]             /* default small screens */
  sm:w-[5vw] sm:h-[5vw]         /* small phones */
  md:w-[5vw] md:h-[5vw]         /* tablets */
  lg:w-[5vw] lg:h-[5vw]         /* laptops */
  xl:w-[5vw] xl:h-[5vw]     /* desktops */
  2xl:w-[5vw] 2xl:h-[5vw]       /* very large screens */
  max-w-[120px] max-h-[120px]   /* cap size on big screens */
  select-none cursor-grab active:cursor-grabbing
`;
