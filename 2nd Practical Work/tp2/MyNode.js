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
		this.animations = [];
		
	    this.transformMatrix = mat4.create();
    	mat4.identity(this.transformMatrix);

	    this.animationMatrix = mat4.create();
    	mat4.identity(this.animationMatrix);

    	this.animation_time_passed_by=0;	
	};

	/**
     * Adds Node child.
     * @param {string} id
     */
	addChild(id) {
    	this.children.push(id);
	};
	
	/**
     * Adds leaf to node.
     * @param {MyLeaf} leaf
     */
	addLeaf(leaf) {
   		this.leaves.push(leaf);
	};

	/**
     * Adds material to node.
     * @param {string} matId
     */
	addMaterial(matId) {
		this.materials.push(matId);
		if(this.activeMaterial == null)
			this.activeMaterial = matId;
	};

	/**
     * Adds animation to node.
     * @param {Animation} anima
     */
	addAnimation(anima){
        this.animations.push(anima);
	};

	/**
     * Sets node's texture.
     * @param {string} tex
     * @param {float} S
     * @param {float} T
     */
	setTexture(tex, S, T) {
		this.textureId = tex;
		this.textureS = S;
		this.textureT = T;
	};


	/**
     * Sets node's active material.
     * @param {string} matId
     */
	setActiveMaterial(matId) {
		this.activeMaterial = matId;
	};

	/**
     * Updates node's animation.
     * @param {float} deltaTime
     */
	updateAnimations(deltaTime) {

        deltaTime=deltaTime/1000 - this.animation_time_passed_by;
		var i=0;
         for(i; i<this.animations.length;i++){
			if(this.animations[i].finished==false)
				if(this.animations[i].time >= deltaTime){
					this.animations[i].update(deltaTime);
					this.animations[i].apply(this);
					break;
				}
				else{
					//for the n+1 iteration after n iteration is finished (when previous animation is finished)
					deltaTime = deltaTime - this.animations[i].time;	
					//so that the delta time of the following animation is reset(next update)	
					this.animation_time_passed_by+=this.animations[i].time;
					this.animations[i].finished=true;
				}
			}       
	};

	updateShaders(deltaTime){
		
	}
};