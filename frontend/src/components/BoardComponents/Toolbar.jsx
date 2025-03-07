import React, { useContext } from "react";
import { LuRectangleHorizontal } from "react-icons/lu";
import {
  FaArrowRight,
  FaDownload,
  FaEraser,
  FaFont,
  FaPaintBrush,
  FaRedoAlt,
  FaRegCircle,
  FaSlash,
  FaUndoAlt,
} from "react-icons/fa";
import { TOOL_ITEMS } from "../../constants";
import boardContext from "../../store/board-context";

const ToolBar = () => {
  const { activeToolItem, changeToolHandler, undo, redo } = useContext(boardContext);

  const handleDownloadClick = () => {
    const canvas = document.getElementById("canvas");
    const data = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = data;
    anchor.download = "board.png";
    anchor.click();
  };

  return (
    <div className="absolute left-1/2 top-5 px-3 py-2 flex rounded border border-gray-400 bg-white shadow-md transform -translate-x-1/2">
      {[
        { tool: TOOL_ITEMS.BRUSH, icon: <FaPaintBrush /> },
        { tool: TOOL_ITEMS.LINE, icon: <FaSlash /> },
        { tool: TOOL_ITEMS.RECTANGLE, icon: <LuRectangleHorizontal /> },
        { tool: TOOL_ITEMS.CIRCLE, icon: <FaRegCircle /> },
        { tool: TOOL_ITEMS.ARROW, icon: <FaArrowRight /> },
        { tool: TOOL_ITEMS.ERASER, icon: <FaEraser /> },
        { tool: TOOL_ITEMS.TEXT, icon: <FaFont /> },
      ].map(({ tool, icon }) => (
        <div
          key={tool}
          className={`flex justify-center items-center text-xl p-3 text-black mr-5 last:mr-0 cursor-pointer rounded ${
            activeToolItem === tool ? "bg-blue-200 text-gray-700" : "hover:bg-blue-50 hover:text-gray-700"
          }`}
          onClick={() => changeToolHandler(tool)}
        >
          {icon}
        </div>
      ))}

      {/* Undo Button */}
      <div
        className="flex justify-center items-center text-xl p-3 text-black mr-5 cursor-pointer rounded hover:bg-blue-50 hover:text-gray-700"
        onClick={undo}
      >
        <FaUndoAlt />
      </div>

      {/* Redo Button */}
      <div
        className="flex justify-center items-center text-xl p-3 text-black mr-5 cursor-pointer rounded hover:bg-blue-50 hover:text-gray-700"
        onClick={redo}
      >
        <FaRedoAlt />
      </div>

      {/* Download Button */}
      <div
        className="flex justify-center items-center text-xl p-3 text-black cursor-pointer rounded hover:bg-blue-50 hover:text-gray-700"
        onClick={handleDownloadClick}
      >
        <FaDownload />
      </div>
    </div>
  );
};

export default ToolBar;
