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

export function removeFromConsole(path: string) {
    let parts = path.split(".");
    let obj = window as any;
    for (let i = 0; i < parts.length - 1; i++) {
        if (obj[parts[i]] === undefined) {
            return;
        }
        obj = obj[parts[i]];
    }
    delete obj[parts[parts.length - 1]];
}

export function downloadBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    downloadUrl(url, fileName);
    URL.revokeObjectURL(url);
}

export function downloadString(str: string, fileName: string) {
    const blob = new Blob([str], {type: "text/plain"});
    downloadBlob(blob, fileName);
}

export function downloadJson(obj: any, fileName: string) {
    const blob = new Blob([JSON.stringify(obj, null, 2)], {type: "application/json"});
    downloadBlob(blob, fileName);
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function setUnscrollable(element: HTMLElement) {
    element.style.overflow = "hidden";

}
