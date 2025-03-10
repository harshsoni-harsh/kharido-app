// "use client";

// import { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ProductCard.jsx";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// const cards = [
//   { id: 1, title: "Fruits", color: "bg-red-300" },
//   { id: 2, title: "Vegetables", color: "bg-green-300" },
//   { id: 3, title: "Dairy", color: "bg-blue-300" },
//   { id: 4, title: "Bakery", color: "bg-yellow-300" },
// ];

// export default function HorizontalCardSlider() {
//   const [index, setIndex] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);

//   useEffect(() => {
//     if (isPaused) return;
//     const interval = setInterval(() => {
//       setIndex((prev) => (prev + 1) % cards.length);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, [isPaused]);

//   const moveLeft = () => setIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
//   const moveRight = () => setIndex((prev) => (prev + 1) % cards.length);

//   return (
//     <div className="relative w-full max-w-2xl mx-auto flex items-center space-x-4 overflow-hidden h-64">
//       {/* Left Button */}
//       <button className="absolute left-0 z-10 bg-white p-2 rounded-full shadow-md" onClick={moveLeft}>
//         <ChevronLeft size={24} />
//       </button>

//       {/* Card Slider */}
//       <div className="w-full flex justify-center overflow-hidden">
//         <motion.div
//           className="flex space-x-4"
//           initial={{ x: 0 }}
//           animate={{ x: -index * 250 }}
//           transition={{ type: "tween", duration: 0.2 }}
//         >
//           {cards.map((card) => (
//             <motion.div
//               key={card.id}
//               className={`w-60 h-40 flex-shrink-0 rounded-xl ${card.color} text-white flex items-center justify-center`}
//               onMouseEnter={() => setIsPaused(true)}
//               onMouseLeave={() => setIsPaused(false)}
//             >
//               <Card className="w-full h-full bg-transparent border-none shadow-none">
//                 <CardContent className="flex items-center justify-center h-full text-xl font-semibold">
//                   {card.title}
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </motion.div>
//       </div>

//       {/* Right Button */}
//       <button className="absolute right-0 z-10 bg-white p-2 rounded-full shadow-md" onClick={moveRight}>
//         <ChevronRight size={24} />
//       </button>
//     </div>
//   );
// }
