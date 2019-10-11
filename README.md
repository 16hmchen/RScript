# 基于原生javascript的响应式框架
原理：
  
在网页初始化完毕之后，自动生成对应的虚拟DOM结构。之后每次DOM节点操作都是操作在虚拟DOM结构上，当所有DOM节点操作执行完毕之后，再通过diff算法将虚拟DOM结构应用到真实DOM中。这样做可以避免多次进行DOM操作造成的大量回流，对网页造成过大的压力，以及响应过慢影响用户体验。

项目运行：
  
	安装依赖：npm install
  
	运行项目：npm run dev

<a href="https://github.com/16hmchen/RScript/blob/master/src/element.js">虚拟dom节点主要代码 elements.js</a>

通过new VNode()生成虚拟dom节点对象，对象的操作方法具体查看文档。

在src/index里面有一个小demo，可以参考一下。
