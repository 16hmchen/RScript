/** 
 *  @param tag: 节点的标签
 *  @param props: 节点的属性，class/id/value等
 *  @param children: 该节点的子节点
 */
class VNode {
    /**
     * 
     * @param {*} tag: 节点标签
     * @param {*} props: 节点属性
     * @param {*} children: 节点的子节点
     */
    constructor (tag, props, children) {
        this.tag = tag;
        this.props = props
        this.children = children
        this.id = this.props.id || undefined;
        this.class = this.props.class ? this.props.class.replace(/\s+/g," ").split(" ") : [];
        // 后期要实现将这两个数据进行双向绑定，可以直接调用css()方法来设置样式，也可以直接通过this.style="background: black;color: red;"来修改样式
        // 文字版的style样式 如 "background: black;color: red;"
        this._style = this.props.style ? this.props.style.replace(/\s+/g,"") : "";
        // 对象版的style样式 如 {background: 'black', color: 'red'}
        this.style = this._style ? this.initStyle(this._style) : {};
        let that = this;
        // 对style对数据拦截，当修改到节点的样式时，会讲string类型的style同步更新
        // 比如，VDom.css('background', 'red')时，_style和props.style会同步更新，加上"background: red;"
        let handle = {
            get (target, key) {
                return target[key];
            },
            set (target, key, value) {
                target[key] = value;
                that._style = that.props.style = this.toString(target);
                return true;
            },
            toString (styleObj){
                let styleStr = "";
                for (let key in styleObj) {
                    let styleItem = `${key}: ${styleObj[key]};`;
                    styleStr += styleItem;
                }
                return styleStr;
            }
        }
        this.style = new Proxy(this.style, handle);
    }
    /**
     * 
     * @param {*} styleStr 
     * 将字符串类型的style样式转成对象格式
     */
    initStyle (styleStr) {
        let styleList = styleStr.split(";");
        let styleObj = {};
        for (let styleItem of styleList) {
            if (styleItem && styleItem != "") {
                let [key, value] = styleItem.split(":");
                styleObj[key] = value;
            }
        }
        return styleObj;
    }

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
     * @param {...any} className 
     * 向被选元素添加一个或多个类
     * usage: VNode.addClass(class1, class2, ..., classn)
     * 如果需要传入数组，请使用Spread操作符，如VNode.addClass(...classList)
     */
    addClass (...classList) {
        classList.map(className => className.toString());
        this.class = this.class.concat(classList);
        return this;
    }

    /**
     * 
     * @param  {...any} classList 
     * 从被选元素删除一个或多个类
     * usage: VNode.removeClass(class1, class2, ..., classn)
     * 如果需要传入数组，请使用Spread操作符，如VNode.removeClass(...classList)
     */
    removeClass (...classList) {
        classList.map(className => className.toString());
        classList.forEach(className => {
            let idx = this.class.indexOf(className)
            if (idx != -1) {
                this.class.splice(idx, 1);
            }
        })
        return this;
    }

    /**
     * 
     * @param  {...any} classList 
     * 对被选元素进行添加/删除类的切换操作
     */
    toggleClass (...classList) {
        classList.map(className => className.toString());
        classList.forEach(className => {
            let idx = this.class.indexOf(className);
            if (idx != -1) {
                this.removeClass(className)
            } else {
                this.addClass(className)
            }
        })
        return this;
        
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
            return this.style || null;
        }
        if (key && !value) {
            return this.style[key];
        } else {
            this.style[key] = value;
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