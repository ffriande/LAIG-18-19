/**
 * MyNode
 * @constructor
 */
class MyNode
{
	constructor(graph,id) 
	{
		this.graph = graph;
    	this.id = id;
    	this.children = [];
	    this.leaves = [];
	    this.material = [];
	    this.texture = [];
	
	    this.transformMatrix = mat4.create();
    	mat4.identity(this.transformMatrix);
	};

	addChild(id) {
    	this.children.push(id);
	};
	
	addLeaf(leaf) {
   		this.leaves.push(leaf);
	};

	addMaterial(matId) {
		this.material.push(matId);
	};

	addTexture(texId) {
		this.material.push(texId);
	};
};