import { createElement, render, renderDOM } from './element'
import { diff } from './diff'
import { patch } from './patch'
import { create } from 'domain';
/**
 * 
 * @param {*} el
 * 将真实dom节点的属性提取出来 
 */
let getAttrs = function (el) {
    let attrs = {};
    let elAttrs = el.attributes
    for(let i = 0; i < elAttrs.length; ++i){
        attrs[elAttrs[i].name] = elAttrs[i].value;
    }
    return attrs;
}

/**
 * 
 * 将真实DOM结构转换成虚拟DOM结构
 */
window.HTMLElement.prototype.toVirtual = function(){
    let el = this;
    let tag = el.tagName.toLocaleLowerCase();
    let attrs = getAttrs(el);
    let children = [];
    for (let nodeList = el.childNodes, idx = 0, len = nodeList.length; idx < len; ++idx){
        if (nodeList[idx].nodeName.toLocaleLowerCase() == '#text'){
            // 去除掉多余的空格/回车，避免生成空节点
            let text = nodeList[idx].data.replace(/\n\s*/g,"").replace(" ","");
            // 创建一个文本标签
            if (text != "") {
                children.push(createElement('text', {}, [text], nodeList[idx]));
            }
        } else {
            children.push(nodeList[idx].toVirtual());
        }
    }
    // console.log(createElement(el, tag, attrs, children))
    return createElement(tag, attrs, children, el);
}

/**
 * 
 * 移除真实dom节点的所有子节点
 */
window.HTMLElement.prototype.removeAllChild = function(){
    var el = this;
    while (el.hasChildNodes()) {
        el.removeChild(el.firstChild);
    }
    return el;
}

/**
 * 
 * 清除dom节点内的空标签(text标签但是里面无内容)
 */
window.HTMLElement.prototype.cleanWhitespace = function(){
    let element = this;
    for(let i=0; i < element.childNodes.length; ++i){   
        var node = element.childNodes[i];   
        if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) {   
            node.parentNode.removeChild(node);   
        }   
    }   
}

/**
 * 初始化，将body内所有标签转成虚拟dom
 */
window.VTreeInit = function(){
    /**
     * _VTree 用来储存修改之前的虚拟DOM
     * VTree 用来储存修改之后的虚拟DOM
     * 之后使用diff算法来进行比较
     */
    let body = document.body;
    window._VTree = body.toVirtual();
    window.VTree = _VTree.copy();
}


function changed(node1, node2) {
    return typeof node1 !== typeof node2 || 
            typeof node1 === 'string' && node1 !== node2 ||
            node1.type !== node2.type
}
/**
 * 
 * @param {*} $parent 
 * @param {*} newNode 
 * @param {*} oldNode 
 * @param {*} index 
 * diff 算法实现，还未完成
 * 目前只能实现增加结点，其他功能还在完善
 */
function updateElement($parent, newNode, oldNode, index = 0) {
    if ($parent && $parent.tagName) $parent.cleanWhitespace();
    if(!oldNode){
        $parent.parentNode.appendChild(
            newNode.render()
        );
    } else if( !newNode ){
        $parent.removeChild(
            $parent.childNodes[index]
        );
    } else if(changed(newNode, oldNode)) {
        newNode = typeof newNode == 'string'?document.createTextNode(newNode):newNode.render();
        $parent.replaceChild(
            newNode,
            $parent.childNodes[index]
        );
    } else if (newNode.tag) {
        const newLength = newNode.children.length;
        const oldLength = oldNode.children.length;
        for(let i = 0; i < newLength || i < oldLength; i++){
            updateElement(
                $parent.childNodes[index],
                newNode.children[i],
                oldNode.children[i],
                i
            );
        }
    }
}

function isDef (v){
    return v !== undefined && v !== null
}

function sameInputType (a, b) {
    if (a.tag !== 'input') return true
    let i;
    const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
    const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
    return typeA === typeB;
}
function isSameVNode (a, b) {
    return (
      a.tag === b.tag &&  // 标签名
      // 是否都定义了data，data包含一些具体信息，例如onclick , style
      isDef(a.props) === isDef(b.props) &&  
      sameInputType(a, b) // 当标签是<input>的时候，type必须相同
    )
}

function patch (oldVNode, VNode) {
    if (isSameVNode(oldVNode, VNode)) {
        patchVNode(oldVNode, VNode);
    }
}

function patchVNode (oldVNode, VNode) {
    const el = VNode.el = oldVNode.el
    let i, oldCh = oldVNode.children, ch = VNode.children
    if (oldVNode === VNode) return
    if (oldVNode.text !== null && VNode.text !== null && oldVNode.text !== VNode.text) {
        api.setTextContent(el, VNode.text)
    }else {
        updateEle(el, VNode, oldVNode)
        if (oldCh && ch && oldCh !== ch) {
            updateChildren(el, oldCh, ch)
        }else if (ch){
            createEle(VNode) //create el's children dom
        }else if (oldCh){
            api.removeChildren(el)
        }
    }
}


/**
 * 上面是方法定义，待封装
 * 下面的代码可以进行操作
 */

//初始化
// VTreeInit();

// //为虚拟dom增加虚拟节点
// window.DIVNODE = createElement('div', {'class': 'myTag tag1 tag2', 'id':'tag'}, [
//     createElement('span', {}, ['我是使用虚拟dom增加的子节点'])
// ])

// window.VTree.children.push(DIVNODE);

// window.VDOM = createElement('div', {class: 'tag test', id: 'tag', style: 'background: black; color: red;  font-size : 16px;'});

// VTree.children[0].children[0].children.push(
//     createElement('tr', {}, [
//         createElement('td', {'class': 'myTag'}, [createElement('h3', {}, ['我是使用虚拟dom增加的子节点'])]),
//         createElement('td', {'style': 'padding: 1em;'}, ['我是使用虚拟dom增加的子节点'])
//     ]),
//     createElement('tr', {}, [
//         createElement('td', {}, ['我是使用虚拟dom增加的子节点']),
//         createElement('td', {}, ['我是使用虚拟dom增加的子节点'])
//     ]),
//     createElement('tr', {}, [
//         createElement('td', {}, ['我是使用虚拟dom增加的子节点']),
//         createElement('td', {}, ['我是使用虚拟dom增加的子节点'])
//     ])
// )

// //修改功能未完成
// // VTree.children[0].children[0].children[1].children[0].children[0] = '我是使用虚拟dom修改的节点'

// let realDOM = document.body;

// // 将修改后的dom更新到real DOM中
// updateElement(realDOM, VTree, _VTree)