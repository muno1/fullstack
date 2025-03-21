import { Facebook } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between w-full px-6 py-2  ">
      <div className="flex items-center space-x-2 ps-5 pt-2px translate-y-1">
        <Facebook className="w-7 h-7" color="blue" />
        <h1 className="text-xl font-bold text-black">FAANG AI</h1>
      </div>
    </div>
  );
}
