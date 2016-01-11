
/*
http://stackoverflow.com/questions/21064101/understanding-offsetwidth-clientwidth-scrollwidth-and-height-respectively
*/

/*
var cc1 = document.getElementById("cc1");
cc1.onscroll = function(){
  scrolling(this);
};


function scrolling(element) {
    var y = element.scrollTop;
    document.getElementById ("scroll-value").innerHTML = "Vertically: " + y + "px";
}

function moveme() {
	//var ec3 = document.getElementById("ec3");
	cc1.scrollTop = 361;
}
*/

var sampleRightSubtree = {
	a : "a",
	b : {
		bb1 : "bb1",
		bb2 : "bb2",
		bb3 : {
			bbb1 : "bbb1",
			bbb2 : "bbb2"
		},
	},
	c : "c",
	d : {
		dd1 : "dd1",
		dd2 : "dd2"
	}
};

/* parent - parent div element, subtree - part of the json tree file */
function subtreeGenerator(parent, subtree) {

	var connectorContainer = document.createElement("div");
	connectorContainer.setAttribute("class", "connector-container");
	var connectorTextNode = document.createTextNode("{"); 
	connectorContainer.appendChild(connectorTextNode);

	var childContainer = document.createElement("div");
	childContainer.setAttribute("class", "child-container");

	for (key in subtree) {
		var value = subtree[key];
		if (typeof value == "object") {
			var childSubContainer = document.createElement("div");
			childSubContainer.setAttribute("class", "child-container");
			var child = document.createElement("div");
			child.setAttribute("class", "child-parent");
			//TODO set postion: relative; top: middle of number of all sub-elements
			var textNode = document.createTextNode(key); 
			child.appendChild(textNode);
			childSubContainer.appendChild(child);
			subtreeGenerator(childSubContainer, value);
			childContainer.appendChild(childSubContainer);
		} else {
			var child = document.createElement("div");
			child.setAttribute("class", "child");
			var textNode = document.createTextNode(value); 
			child.appendChild(textNode);
			childContainer.appendChild(child);
		}
	}
	
	
	parent.appendChild(connectorContainer);
	parent.appendChild(childContainer);
}

var parentElement = document.getElementById("generator-parent");
subtreeGenerator(parentElement, sampleRightSubtree);

function testCanvas() {
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	
	//poziom, pion
	//ctx.moveTo(0,100);
	//ctx.bezierCurveTo(40,290,0,10,40,0);
	//ctx.bezierCurveTo(12,100,12,0,24,0);
	//24x108

	for (var i=0; i<6; i++) {
		var j = 9 + 18 * i;
		ctx.beginPath();
		ctx.moveTo(0,9);
		ctx.bezierCurveTo(12,9,12,j,24,j);
		ctx.stroke();
	}

	ctx.beginPath();
	//poziom, pion
	//ctx.moveTo(0,100);
	//ctx.bezierCurveTo(40,290,0,10,40,0);
	//ctx.bezierCurveTo(12,100,20,28,40,28);
	ctx.stroke();
}

testCanvas();


function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
  
    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
}

/* height calculations */
var rcc = document.getElementById("rcc");
console.log("wysokosc: " + rcc.scrollHeight);
var rc2 = document.getElementById("rc2");
console.log("offsetTop: " + rc2.offsetTop);
console.log("offsetHeight: " + rc2.offsetHeight);



function shadeColor(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

var MMNode = function (parentNode, nodeName, backgroundColor) {
  this.parentNode = parentNode;
  this.nodeName = nodeName;
  this.backgroundColor = backgroundColor;
  this.children = [];
  this.addChild = function (child) {
  	this.children.push(child);
  };
  this.getBackgroundColor = function() {
  	if (this.backgroundColor) {
  		return this.backgroundColor;
  	} else {
  		if (this.parentNode && this.parentNode.backgroundColor) {
  			return shadeColor(this.parentNode.getBackgroundColor(), 0.2);
  		} else {
  			return "#000000";
  		}
  	}
  };
};

var colors = ["#F44336", "#FF4081", "#9C27B0", "#673AB7"];
var MAX_DEPTH = 3;
var MAX_CHILDREN = 5;

var mainNode = new MMNode(null, "MindMap");

function prepareTestData(parentNode, depth) {
	var childrenCount = Math.floor(Math.random() * MAX_CHILDREN) + 1;

	for (var i=0; i<childrenCount; i++) {

		var color;
		if (depth == 0) {
			color = colors[i];
		} else {
			color = parentNode.backgroundColor;
		}

		var childNode = new MMNode(mainNode, "Node_" + depth + "_" + i, color);
		if (depth < MAX_DEPTH) {
			prepareTestData(childNode, depth+1);
		}
		parentNode.addChild(childNode);
	}

	

	//Math.floor((Math.random() * 10)
/*
	for (var i=0; i<15; i++) {
		var l1 = new MMNode(mainNode, "NodeL0_" + i, colors[i%3]);
		mainNode.addChild(l1);
		for (var j=0; j<4; j++) {
			var l2 = new MMNode(l1, "NodeL0_" + i + "_L1_" + j);
			l1.addChild(l2);
		}
	}
	return mainNode;
	*/
}

//var mainNode = prepareTestData();
prepareTestData(mainNode, 0);

var renderLists = [];

function traverse(node, level) {
	if (node.children.length > 0) {
		if (!renderLists[level]) {
			renderLists[level] = [];
		}


		Array.prototype.push.apply(renderLists[level], node.children);
		for (var i=0; i<node.children.length; i++) {
			traverse(node.children[i], level+1);
		}
	}
}

traverse(mainNode, 0);

function nodeRender(node) {

}


var ELEMENT_HEIGHT = 30;

function render(lists) {
	var mainContainer = document.createElement("div");
	mainContainer.setAttribute("class", "main-container");

	for (var i=0; i<lists.length; i++) {
		var columnContainer = document.createElement("div");
		columnContainer.setAttribute("id", "cc" + i);
		columnContainer.setAttribute("class", "column-container");

		var list = lists[i];
		var childrenBefore = 0;
		for (var j=0; j<list.length; j++) {
			var node = list[j];
			var elementContainer = document.createElement("div");
			elementContainer.setAttribute("class", "element-container");
			elementContainer.setAttribute("targetLevel", i+1);
			elementContainer.setAttribute("childrenBefore", childrenBefore);
			elementContainer.setAttribute("style", "background-color:" + node.getBackgroundColor() + ";");
			
			var childrenCount = node.children.length;
			if (childrenCount > 0) {
				elementContainer.onclick = function () {
					var scrolledColumnContainerId = "cc" + this.getAttribute("targetLevel");
					var offset = this.getAttribute("childrenBefore") * ELEMENT_HEIGHT;
					var scrolledColumnContainer = document.getElementById(scrolledColumnContainerId);
					scrolledColumnContainer.scrollTop = offset;
				}
				childrenBefore += childrenCount;
			}
			var textNode = document.createTextNode(node.nodeName); 
			elementContainer.appendChild(textNode);
			columnContainer.appendChild(elementContainer);
		}

		mainContainer.appendChild(columnContainer);
	}

	return mainContainer;
}

//document.body.appendChild(render(renderLists));