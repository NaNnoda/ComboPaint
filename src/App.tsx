import React from "react";
import {createRoot} from "react-dom/client";
import ViewerCanvasComponent from "./ReactUI/ViewerCanvasComponent";

/**
 * The main entry point for the application.
 * @constructor
 */
function App() {
    return <div id="app">
        <ViewerCanvasComponent/>
    </div>;
}


// export default App;

// Bind the application to the DOM.
const rootDom = document.getElementById('root') as HTMLElement;
const root = createRoot(rootDom);
root.render(<App/>);

console.log("App.tsx: App() rendered");
