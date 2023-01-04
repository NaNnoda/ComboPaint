import React from "react";
import ReactDOM from "react-dom";
import {createRoot} from "react-dom/client";
import CanvasReact from "./UIReact/CanvasReact";

let w = window as any;

w.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    _renderers: {},
    supportsFiber: true,
    inject: () => ({}),
    onCommitFiberRoot: () => ({}),
    onCommitFiberUnmount: () => ({}),
};

function App() {
    return <div id="app">
        <CanvasReact/>
    </div>;
}


// export default App;


const rootDom = document.getElementById('root') as HTMLElement;
const root = createRoot(rootDom);
root.render(<App/>);

console.log("App.tsx: App() rendered");
