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
	    this.materials = [];
	    this.activeMaterial = null;
	    this.textureId = null;
	    this.textureS = null;
	    this.textureT = null;
	
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
		this.materials.push(matId);
		if(this.activeMaterial == null)
			this.activeMaterial = matId;
	};

	setTexture(tex, S, T) {
		this.textureId = tex;
		this.textureS = S;
		this.textureT = T;
	};

	setActiveMaterial(matId) {
		this.activeMaterial = matId;
	};
};