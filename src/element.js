/** 
 *  @param tag: 节点的标签
 *  @param props: 节点的属性，class/id/value等
 *  @param children: 该节点的子节点
 */
class VNode {
    constructor (tag, props, children) {
        this.tag = tag
        this.props = props
        this.children = children
    };
    /** 
     * @param el: 要往该节点中添加的目标子节点
     * 调用该方法可以在该节点的内部的最后添加上目标子节点
     */
    appendChild (el) {
        if (el instanceof VNode) {
            this.children.push(el);
        } else {
            console.error('参数el必须为VNode实例')
        }
        return this;
    };
    /*
    ** 在当前节点中查找目标节点
    ** 使用方法类似于JQuery，可以用标签选择器进行查找，例如VNode.$('#id')、VNode.$('.class')、VNode.$('div')
    */
    $ (selector) {
        console.log(selector);
    }
    /**
     * 拷贝结点，这个到时候把代码改一下
     */
    _nodeCopy (obj) {
        let oriEl = obj;
        let tag = oriEl.tag;
        let props = oriEl.props;
        let children = [];

        if (typeof obj == 'string') {
            return obj;
        }
        if (oriEl.children) {
            for (let nodeList = oriEl.children, idx = 0, len = nodeList.length; idx < len; ++idx){
                children.push(this._nodeCopy(nodeList[idx]));
            }
        }
        return createElement(tag, props, children);
    }
    copy () {
        return this._nodeCopy(this)
    }
    /**
     * 将结点转换成真实结点
     */
    render () {
        return this._render(this)
    }
    _render (virtualDom) {
        let tag = virtualDom.tag
        let props = virtualDom.props
        let children = virtualDom.children
    
        let el = document.createElement(tag)
        Object.keys(props).forEach(prop => {
            setAttr(el, prop, props[prop])
        })
    
        children.forEach(child => {
            if (child instanceof VNode) {
                el.appendChild(this._render(child))
            } else {
                el.appendChild(document.createTextNode(child))
            }
        })
        return el;
    }
    /**
     * 
     * @param {*} key 
     * @param {*} value 
     * 获取css样式
     * 若key值为空，则返回所有css样式
     * 若不为空，则返回该值的css样式
     * 若value不为空，则将css样式设置为value值
     */
    css (key, value) {
        let _key = key || "";
        let _value = value || "";
        if (!key) {
            return this.props.css || null;
        }
        if (key && !value) {
            return this.props.css[key];
        } else {
            this.props.css[key] = value;
            return this;
        }
    }
}

/** 
 *  @param tag: 节点的标签
 *  @param props: 节点的属性，class/id/value等
 *  @param children: 该节点的子节点
 *  创建虚拟DOM节点
 */
function createElement(tag, props, children) {
    var props = props || {};
    return new VNode(tag, props, children)
}

/**
 * 
 * @param {*} virtualDom: 要用于生成真实DOM的虚拟DOM结构
 * 将虚拟DOM转换成真实DOM
 */
function render(virtualDom) {
    let tag = virtualDom.tag
    let props = virtualDom.props
    let children = virtualDom.children

    let el = document.createElement(tag)
    Object.keys(props).forEach(prop => {
        setAttr(el, prop, props[prop])
    })

    children.forEach(child => {
        if (child instanceof VNode) {
            el.appendChild(render(child))
        } else {
            el.appendChild(document.createTextNode(child))
        }
    })

    return el;
}

/**
 * 
 * @param {*} el: 目标节点
 * @param {*} key: 属性名称
 * @param {*} value: 属性值
 * 为即将创建的真实DOM节点设置属性
 */
function setAttr(el, key, value) {
    switch (key) {
        case 'value':
            if (Node.tagName.toUpperCase() === 'INPUT' || Node.tagName.toUpperCase() === "TEXTAREA") {
                node.value = val
            } else {
                el.setAttribute(key, value)
            }

            break;
        case 'style':
            el.style.cssText = value
            break;
        default:
            el.setAttribute(key, value)
    }
}

/**
 * 
 * @param {*} el: 真实DOM结构
 * @param {*} root: 目标DOM节点
 * 将真实DOM结构挂载到目标DOM节点上
 */
function renderDOM(el, root) {
    if (Object.prototype.toString.call(root) === '[object String]') {
        if (el instanceof HTMLCollection) { 
            for(let el_item of el) {
                document.querySelector(root).appendChild(el_item)
            }
        } else {
            document.querySelector(root).appendChild(el);
        }
    } else {
        if (el instanceof HTMLCollection) { 
            for(let el_item of el) {
                root.appendChild(el_item);
            }
        } else {
            root.appendChild(el)
        }
        
    }
}


export { createElement, render, renderDOM, VNode, setAttr }