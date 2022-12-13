class DropdownNode {
    text: string;
    name: string;
    children: DropdownNode[];

    constructor(text: string, name: string, children: DropdownNode[] = []) {
        this.text = text; // The text to display
        this.name = name; // The name of the node
        this.children = children; // The children of the node
    }
}

export class DropdownManager {
    _div

    dropdownNodes: DropdownNode[] = [];

    constructor(div: HTMLDivElement) {
        this._div = div;
    }

    get div() {
        return this._div;
    }

    addDropdown(tagName: string, optionName: string, onClick: () => void) {
        console.log("Adding dropdown");

        let parts = tagName.split(".");
        let currentDict = this.dropdownNodes;
        for (let part of parts) {
            let found = false;
            for (let node of currentDict) {
                if (node.name == part) {
                    currentDict = node.children;
                    found = true;
                    break;
                }
            }
            if (!found) {
                let newNode = new DropdownNode(part, part);
                currentDict.push(newNode);
                currentDict = newNode.children;
            }
        }


        this.update();
    }

    update() {
        // clear the div
        this.div.innerHTML = "";

        let root = this.div;

        // add the dropdowns
        for (let node of this.dropdownNodes) {
            let dropdown = document.createElement("div");
            dropdown.classList.add("dropdown");
            dropdown.innerHTML = node.text;
            dropdown.addEventListener("click", () => {
                console.log("Clicked dropdown");
                dropdown.classList.toggle("active");
            });

            let dropdownContent = document.createElement("div");
            dropdownContent.classList.add("dropdown-content");

            for (let child of node.children) {
                let childDiv = document.createElement("div");
                childDiv.innerHTML = child.text;
                dropdownContent.appendChild(childDiv);
            }

            dropdown.appendChild(dropdownContent);

            root.appendChild(dropdown);
        }
    }
}
