export function downloadUrl(url: string, fileName: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
}

export function addToConsole(path: string, value: any) {
    let parts = path.split(".");
    let obj = window as any;
    for (let i = 0; i < parts.length - 1; i++) {
        if (obj[parts[i]] === undefined) {
            obj[parts[i]] = {};
        }
        obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
}

// export function addVoidFunctionToConsole(command: string, func: () => any) {
//     let parts = command.split(".");
//     if (parts.length < 2) {
//         throw new Error("Invalid command");
//     }
//     let w = window as any;
//     for (let i = 0; i < parts.length - 1; i++) {
//         if (w[parts[i]] === undefined) {
//             w[parts[i]] = {};
//         }
//         w = w[parts[i]];
//     }
//
//     let last = parts[parts.length - 1];
//     if (last === undefined) {
//         throw new Error("Invalid command");
//     }
//     // Object.defineProperty(last, `${func}`, {
//     //     get: () => {
//     //         return func();
//     //     }
//     // })
//     w[last] = {
//         get: function () {
//             return func();
//         }
//     };
//
//     // addConsoleVar(command, func);
// }
