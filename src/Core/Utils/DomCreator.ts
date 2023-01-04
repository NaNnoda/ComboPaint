export function addBtnToDom(text: string,
                            className: string,
                            onclick: () => void,
                            parent: HTMLElement = document.body) {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.className = className;
    btn.onclick = onclick;
    parent.appendChild(btn);
}
