import {createApp} from "./ReactUI/App";

createApp(document.getElementById("root") as HTMLElement);

// // store a reference to our file handle
// let fileHandle;
//
// async function getFile() {
//     // open file picker
//     let w = window as any;
//     let fileHandles = await w.showOpenFilePicker();
//     let fileHandle = fileHandles[0];
//     fileHandle = fileHandle as FileSystemFileHandle;
//     console.log(fileHandle);
//
//     // get file
//     const file = await fileHandle.getFile();
//     console.log(file);
//
//
//     // const tracer = opentracing.Tracer();
//
//     // read file
//     const contents = await file.text();
//     const blob = await file.arrayBuffer();
//     console.log(contents);
//     console.log(blob);
//
//     // // write file
//     // const writable = await fileHandle.createWritable();
//     // await writable.write(contents + "Hello World");
//     // await writable.close();
//
//
//     if (fileHandle.kind === 'file') {
//         // run file code
//         if (file.name.endsWith(".svg")) {
//             drawSVGString(contents);
//         }
//         if (file.name.endsWith(".png") || file.name.endsWith(".jpg")) {
//             showImageFile(file);
//         }
//     } else if (fileHandle.kind === 'directory') {
//         // run directory code
//     }
// }
//
// function drawSVGString(svgString: string) {
//     let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//     svg.setAttribute("width", "100%");
//     svg.setAttribute("height", "100%");
//     svg.setAttribute("viewBox", "0 0 100 100");
//     svg.innerHTML = svgString;
//     document.body.appendChild(svg);
// }
//
// function showImageFile(file: File) {
//     let reader = new FileReader();
//     reader.onload = (e) => {
//         let dataURL = reader.result;
//         console.log(dataURL);
//         let img = document.createElement("img");
//         img.src = dataURL as string;
//         document.body.appendChild(img);
//
//     };
//     reader.readAsDataURL(file);
// }
//
// // fileHandle is a FileSystemFileHandle
// // withWrite is a boolean set to true if write
//
// let btn = document.createElement("button");
// btn.innerText = "Open File";
// btn.onclick = getFile;
// document.body.appendChild(btn);
//
// let filePicker = document.createElement("input");
// filePicker.type = "file";
// filePicker.onchange = (e) => {
//     console.log(e);
//     let files = filePicker.files;
//     console.log(files);
//     if (files && files.length > 0) {
//         console.log(files[0]);
//     }
// }
// document.body.appendChild(filePicker);
//
// let dropZone = document.createElement("div");
// dropZone.style.width = "100px";
// dropZone.style.height = "100px";
// dropZone.style.border = "1px solid black";
// dropZone.ondragover = (e) => {
//     e.preventDefault();
//     console.log("dragover");
//
// }
//
// async function getHandle(file: DataTransferItem): Promise<FileSystemFileHandle | FileSystemDirectoryHandle | null> {
//     let tmp = file as any;
//     let handle = null
//     if (tmp.getAsFileSystemHandle) {
//         handle = await tmp.getAsFileSystemHandle() as FileSystemFileHandle | FileSystemDirectoryHandle;
//     }
//
//     // return tmp.getAsFileSystemHandle() as Promise<FileSystemFileHandle>;
//     return handle;
// }
//
// async function getHandles(items: DataTransferItemList): Promise<Array<FileSystemFileHandle | FileSystemDirectoryHandle>> {
//     let handles: Array<FileSystemFileHandle | FileSystemDirectoryHandle> = [];
//     console.log(items.length);
//
//     let copy = [];
//     for (let i = 0; i < items.length; i++) {
//         copy.push(items[i]);
//     }
//     console.log(copy);
//
//
//     for (let i = 0; i < copy.length; i++) {
//         let item = copy[i];
//         // kind will be 'file' for file/directory entries.
//         if (item.kind === 'file') {
//             let tmp = item as any;
//             const entry = await tmp.getAsFileSystemHandle() as FileSystemFileHandle | FileSystemDirectoryHandle;
//             copy.push(entry);
//             if (entry.kind === 'file') {
//                 // run code for if entry is a file
//             } else if (entry.kind === 'directory') {
//                 // run code for is entry is a directory
//             }
//         }
//     }
//     return handles;
// }
//
//
// function sleep(ms: number) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }
//
// dropZone.ondrop = async (e) => {
//     e.preventDefault();
//     if (!e.dataTransfer) {
//         return;
//     }
//     console.log("drop");
//     console.log(e.dataTransfer.items);
//     console.log(e.dataTransfer.items.length);
//     let item = e.dataTransfer.items[0];
//     console.log(item);
//     let entry = item.webkitGetAsEntry();
//     console.log(entry);
//     console.log(item.webkitGetAsEntry());
// }
//
//
// document.body.appendChild(dropZone);