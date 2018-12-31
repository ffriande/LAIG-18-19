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
	this.piece_animation_time_since=0;
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
	if(this.leaves[0].primitive!=null &&this.leaves[0].primitive instanceof MyPiece){
		if(this.animations[0]!=null && this.animations[0].finished==false){
			if(this.leaves[0].primitive.scene.game.justMovedPiece){
				this.leaves[0].primitive.scene.game.justMovedPiece=0
				this.piece_animation_time_since=deltaTime;	
			}
			deltaTime-=this.piece_animation_time_since;
			if(this.animations[0].time >= deltaTime){
				this.animations[0].update(deltaTime);
				this.animations[0].apply(this);

			}
			else{
				this.animations[0].finished=true;
				this.animations.splice(0,1);
				this.leaves[0].primitive.scene.game.currentState=this.leaves[0].primitive.scene.game.state.CHOOSING_PIECE
				this.leaves[0].primitive.setPosition(this.leaves[0].primitive.position2be)
			}}
	}
	else{
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
			//else 
			//	this.animations.splice(i,1);
			}}

	};

	updateShaders(deltaTime){
		
	}
};