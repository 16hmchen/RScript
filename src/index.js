import { createElement, render, renderDOM } from './element'
import { diff } from './diff'
import { patch } from './patch'

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
            if (text != "") {
                children.push(text);
            }
        } else {
            children.push(nodeList[idx].toVirtual());
        }
    }
    return createElement(tag, attrs, children);
}

window.HTMLElement.prototype.removeAllChild = function(){
    var el = this;
    while (el.hasChildNodes()) {
        el.removeChild(el.firstChild);
    }
    return el;
}

let body = document.body;

/**
 * 获取#app的结构并生成对应的虚拟DOM
 */
console.log('===> 提取body标签内的所有子节点，并生成虚拟DOM start')
window.VTree = body.toVirtual();
console.log('===> 提取body标签内的所有子节点，并生成虚拟DOM end')

console.log('===> 将body的内容清空')
body.removeAllChild();

/**
 * 根据生成的虚拟DOM生成真实DOM
 */
console.log('===> 根据虚拟DOM结构生成真实DOM结构 start')
let realDOM = render(VTree);
console.log('===> 根据虚拟DOM结构生成真实DOM结构 end')

/**
 * 将生成的真实DOM节点映射到真实DOM中
 */
console.log('===> 将生成的真实DOM节点映射到真实DOM中 start')
renderDOM(realDOM.children, body)
console.log('===> 将生成的真实DOM节点映射到真实DOM中 end')

