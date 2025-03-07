import { createContext } from "react";

const boardContext = createContext({
    activeToolItem: "",
    toolActionType: "",
    elements: [],
    history: [[]],
    index: 0,
    boardMouseDownHandler: () => { },
    changeToolHandler: () => { },
    boardMouseUpHandler: () => { },
    boardMouseMoveHandler: () => { }

})

export default boardContext;