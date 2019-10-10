import { createElement, render, renderDOM } from './element'
import { diff } from './diff'
import { patch } from './patch'

// let VDom1 = createElement('ul', { class: 'list' }, [
//     createElement('li', { class: 'item' }, [
//         createElement('a', { href: '#' }, ['link']),
//     ]),
//     createElement('li', { class: 'item', style: "color:red" }, ['b']),
//     createElement('li', { class: 'item' }, ['c']),
// ])

let VDom1 = createElement('ul', { class: 'lists', style: "color:red" }, [
    createElement('li', { class: 'item' }, ['a']),
    createElement('li', { class: 'item' }, ['b']),
    createElement('li', { class: 'item' }, ['c']),
])

let VDom2 = createElement('ul', { class: 'lists', 'data-key': 'aaa' }, [
    createElement('li', { class: 'item', style: "color:black" }, ['aa']),
    createElement('li', { class: 'item' }, ['1']),
    createElement('li', { class: 'item' }, ['bb'])
])

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
 * @param {*} el: 真实DOM节点
 * 将真实DOM结构转换成虚拟DOM结构
 */
let r2v = function (el) {
    let app = el;
    let tag = app.tagName.toLocaleLowerCase();
    let attrs = getAttrs(el);
    let children = [];
    for (let nodeList = el.childNodes, idx = 0, len = nodeList.length; idx < len; ++idx){
        if (nodeList[idx].nodeName.toLocaleLowerCase() == '#text'){
            children.push(nodeList[idx].data);
        } else {
            children.push(r2v(nodeList[idx]));
        }
    }
    return createElement(tag, attrs, children);
}

/**
 * 获取#app的结构并生成对应的虚拟DOM
 */
let vt = r2v(document.getElementById('app'));
/**
 * 根据生成的虚拟DOM生成真实DOM
 */
let el = render(vt);

document.getElementById('temp').innerText = JSON.stringify(r2v(document.getElementById('app')));
/**
 * 将生成的真实DOM节点映射到#app1中
 */
renderDOM(el, '#app1')

// let el = render(VDom1)

// renderDOM(el, '#app')
// let patchs = diff(VDom1, VDom2);
// patch(el, patchs);
