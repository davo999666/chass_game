// src/utils/classNames.js
export const boardSize = `
  w-[45vw] h-[45vw]           /* default small screens: fills most width */
  sm:w-[45vw] sm:h-[45vw]     /* small phones */
  md:w-[45vw] md:h-[45vw]     /* tablets */
  lg:w-[45vw] lg:h-[45vw]     /* laptops */
  xl:w-[45vw] xl:h-[45vw]     /* desktops */
  2xl:w-[45vw] 2xl:h-[45vw]   /* very large screens */
  max-w-[960px] max-h-[960px] /* never exceed 960x960 */
  shadow-2xl rounded-md
`;
export const pieceSize = `
  w-[5.5vw] h-[5.5vw]             /* default small screens */
  sm:w-[5.5vw] sm:h-[5.5vw]         /* small phones */
  md:w-[5.5vw] md:h-[5.5vw]         /* tablets */
  lg:w-[5.5vw] lg:h-[5.5vw]         /* laptops */
  xl:w-[5.5vw] xl:h-[5.5vw]     /* desktops */
  2xl:w-[5.5vw] 2xl:h-[5.5vw]       /* very large screens */
  max-w-[120px] max-h-[120px]   /* cap size on big screens */
  select-none cursor-grab active:cursor-grabbing
`;
