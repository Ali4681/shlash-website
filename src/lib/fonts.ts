import { Marhey } from "next/font/google";

/** Brand wordmark / hero display */
export const marhey = Marhey({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
