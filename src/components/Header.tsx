// import { FaRegQuestionCircle } from 'react-icons/fa';
import { IoDocumentTextOutline } from "react-icons/io5";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-8 bg-white shadow-md">
      <h1 className="text-3xl font-bold text-cyan-700 flex items-center">
      <IoDocumentTextOutline />  Text Summarizer
      </h1>
      {/* <FaRegQuestionCircle className="text-gray-500 text-2xl cursor-pointer" /> */}
    </header>
  );
}
