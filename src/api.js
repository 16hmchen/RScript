
api = {
    setTextContent(el, text) {
        if (text != undefined && text != "") {
            el.textContent = text;
        }
        return el;
    },
    removeChildren(el) {
        el.parentNode.removeChild(el);
        return el;
    },
    parentNode(el) {
        return el.parentNode;
    },
    nextSibling(el) {
        return el.nextSibling;
    },
    insertBefore(parentNode, insertNode, child) {
        parentNode.insertBefore(insertNode, child);
        return insertNode;
    },
    removeChild(parentNode, childNode) {
        parentNode.removeChild(childNode);
    }
}


module.exports = {
    api
}
// export {test}