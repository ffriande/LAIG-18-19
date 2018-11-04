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

        deltaTime=deltaTime/1000;

//         for(var i=0; i<this.animations.length;i++){
//             var animation = this.graph.animations[this.animations[i]];
            if(this.animations.length>0)
            if(this.animations[0].time >= deltaTime){
                this.animations[0].update(deltaTime);
                this.animations[0].apply(this);
//           break;
        }
            else
                deltaTime = deltaTime - this.animations[0].duration;
//         }
	};
};