import React, { useContext } from "react";
import {
  COLORS,
  FILL_TOOL_TYPES,
  SIZE_TOOL_TYPES,
  STROKE_TOOL_TYPES,
  TOOL_ITEMS,
} from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import boardContext from "../../store/board-context";

const Toolbox = () => {
  const { activeToolItem } = useContext(boardContext);
  const { toolboxState, changeStroke, changeFill, changeSize } =
    useContext(toolboxContext);

  const strokeColor = toolboxState[activeToolItem]?.stroke;
  const fillColor = toolboxState[activeToolItem]?.fill;
  const size = toolboxState[activeToolItem]?.size;

  return (
    <div className="absolute top-1/2 left-5 text-sm border border-gray-400 bg-white p-4 rounded-md shadow-md transform -translate-y-1/2">
      {STROKE_TOOL_TYPES.includes(activeToolItem) && (
        <div className="mb-6">
          <div className="mb-1">Stroke Color</div>
          <div className="flex flex-wrap items-center">
            <input
              type="color"
              className="mr-3 w-10 h-10 rounded border-2 border-neutral-400"
              value={strokeColor}
              onChange={(e) => changeStroke(activeToolItem, e.target.value)}
            />
            {Object.keys(COLORS).map((k) => (
              <div
                key={k}
                className={`w-5 h-5 rounded mr-1 cursor-pointer ${
                  strokeColor === COLORS[k] ? "border border-gray-300 shadow-[0_0_0_1px_#4a47b1]" : ""
                }`}
                style={{ backgroundColor: COLORS[k] }}
                onClick={() => changeStroke(activeToolItem, COLORS[k])}
              ></div>
            ))}
          </div>
        </div>
      )}

      {FILL_TOOL_TYPES.includes(activeToolItem) && (
        <div className="mb-6">
          <div className="mb-1">Fill Color</div>
          <div className="flex flex-wrap items-center">
            {fillColor === null ? (
              <div
                className="mr-3 w-10 h-10 rounded border-2 border-neutral-400 bg-gray-300 cursor-pointer"
                onClick={() => changeFill(activeToolItem, COLORS.BLACK)}
              ></div>
            ) : (
              <input
                type="color"
                className="mr-3 w-10 h-10 rounded border-2 border-neutral-400"
                value={fillColor}
                onChange={(e) => changeFill(activeToolItem, e.target.value)}
              />
            )}
            <div
              className={`w-5 h-5 rounded mr-1 cursor-pointer bg-gray-300 ${
                fillColor === null ? "border border-gray-300 shadow-[0_0_0_1px_#4a47b1]" : ""
              }`}
              onClick={() => changeFill(activeToolItem, null)}
            ></div>
            {Object.keys(COLORS).map((k) => (
              <div
                key={k}
                className={`w-5 h-5 rounded mr-1 cursor-pointer ${
                  fillColor === COLORS[k] ? "border border-gray-300 shadow-[0_0_0_1px_#4a47b1]" : ""
                }`}
                style={{ backgroundColor: COLORS[k] }}
                onClick={() => changeFill(activeToolItem, COLORS[k])}
              ></div>
            ))}
          </div>
        </div>
      )}

      {SIZE_TOOL_TYPES.includes(activeToolItem) && (
        <div className="mb-6">
          <div className="mb-1">
            {activeToolItem === TOOL_ITEMS.TEXT ? "Font Size" : "Brush Size"}
          </div>
          <input
            type="range"
            min={activeToolItem === TOOL_ITEMS.TEXT ? 12 : 1}
            max={activeToolItem === TOOL_ITEMS.TEXT ? 64 : 10}
            step={1}
            value={size}
            className="w-full"
            onChange={(e) => changeSize(activeToolItem, e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default Toolbox;
