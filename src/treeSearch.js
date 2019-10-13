function isLegal(node, prop) {
    if(prop[0] == '#' && node.id &&  node.id.indexOf(prop.slice(1)) != -1) return true;
    if(prop[0] == '.' && node.class && node.class.indexOf(prop.slice(1)) != -1) return true;
    if(node.tag == prop) return true;
}

/**
 * 
 * @param {*} target: 目标节点，要在哪个节点里面进行搜索
 * @param {*} prop: 搜索索引
 * 索引条件在isLegal()里面进行修改
 */
function breadthSearch(target){
    const nodeList = [target];
    let index = 0;
    while (index < nodeList.length) {
        const node = nodeList[index++];
        if (node.children && node.children.length > 0) {
            for (let k in node.children) {
                nodeList.push(node.children[k]);
            }
        }
    }
    return function(prop) {
        let targetNodeList = [];
        for (let node of nodeList) {
            if(isLegal(node, prop)) {
                targetNodeList.push(node);
            }
        }
        return targetNodeList;
    }
}

/**
 * 
 * @param {*} target: 目标节点，要在哪个节点里面进行搜索
 * @param {*} prop: 搜索索引
 * 索引条件在isLegal()里面进行修改
 */
function depthSearch(target){
    const nodeList = [];
    const depthEach = function(item) {
        nodeList.push(item);
        if(item.children){
            for(let k in item.children){
                depthEach(item.children[k]);
            }
        }
    }
    depthEach(target);
    return function(prop) {
        let targetNodeList = [];
        for (let node of nodeList) {
            if(isLegal(node, prop)) {
                targetNodeList.push(node);
            }
        }
        return targetNodeList;
    }
}


module.exports = {
    breadthSearch,
    depthSearch
}