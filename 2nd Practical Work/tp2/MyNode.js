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

	addAnimation(anima){
        this.animations.push(anima);
	};

	setTexture(tex, S, T) {
		this.textureId = tex;
		this.textureS = S;
		this.textureT = T;
	};

	setActiveMaterial(matId) {
		this.activeMaterial = matId;
	};


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