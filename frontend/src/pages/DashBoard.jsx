import ToolBar from "../components/BoardComponents/Toolbar";
import Board from "../components/BoardComponents/Board";
import BoardProvider from "../store/BoardProvider";
import ToolBoxProvider from "../store/ToolBoxProvider";
import Toolbox from "../components/BoardComponents/Toolbox";


const DashBoard = () => {
    return (
        <BoardProvider>
            <ToolBoxProvider>
                <Board/>
                <ToolBar/>
                <Toolbox/>
            </ToolBoxProvider>
        </BoardProvider>
    )
}

export default DashBoard ;