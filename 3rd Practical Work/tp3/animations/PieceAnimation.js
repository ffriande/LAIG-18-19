class PieceAnimation extends Animation
{
    constructor(time, center, radius, init_ang, rot_ang, pos) {

        super(time);
        this.center = center;
        this.radius = radius;
        this.init_ang = init_ang;
        this.rot_ang = rot_ang;
        this.totalDistance = radius*rot_ang;
        this.speed=this.totalDistance/this.time;
        this.pos=this.subtractPoints(pos,[0,0,0])
    }

    /**
     * Updates animation values.
     * @param {float} deltaT
     */
    update(deltaT){
        this.distanceCovered = this.speed * deltaT;
        this.angle = this.init_ang + this.distanceCovered/this.radius;
    }

        /**
     * Applies transformation previously calculated by update function.
     * @param {MyNode} node
     */
    apply(node){
	
        mat4.identity(node.animationMatrix);
        
        mat4.translate(node.animationMatrix,node.animationMatrix, this.pos);
        // console.log("pos ->" +this.pos)
         
        mat4.translate(node.animationMatrix,node.animationMatrix, this.center);     

        // console.log("rad ->" +this.radius)

        // console.log("angle ->" +this.angle)
        
        if(Math.abs(this.pos[0])>this.center[0]){            //move to the left
            mat4.rotate(node.animationMatrix,node.animationMatrix, this.angle*DEGREE_TO_RAD,[0,0,1]);
            mat4.translate(node.animationMatrix, node.animationMatrix, [this.radius, 0,0]);	
            mat4.rotate(node.animationMatrix,node.animationMatrix, -this.angle*DEGREE_TO_RAD,[0,0,1]);
        }
        else if(Math.abs(this.pos[0])<this.center[0]){    //move to the right
            mat4.rotate(node.animationMatrix,node.animationMatrix, -this.angle*DEGREE_TO_RAD,[0,0,1]);            
            mat4.translate(node.animationMatrix, node.animationMatrix, [-this.radius, 0,0]);
            mat4.rotate(node.animationMatrix,node.animationMatrix, this.angle*DEGREE_TO_RAD,[0,0,1]);
        }
        else{
            if(Math.abs(this.pos[2])<this.center[2]){        //move down
                mat4.rotate(node.animationMatrix,node.animationMatrix, this.angle*DEGREE_TO_RAD,[1,0,0]);                
                mat4.translate(node.animationMatrix, node.animationMatrix, [0, 0,-this.radius]);	
                mat4.rotate(node.animationMatrix,node.animationMatrix, -this.angle*DEGREE_TO_RAD,[1,0,0]);
            }
            else{                                   //move up
                mat4.rotate(node.animationMatrix,node.animationMatrix, -this.angle*DEGREE_TO_RAD,[0,0,1]);                
                mat4.translate(node.animationMatrix, node.animationMatrix, [0, 0,this.radius]);	
               mat4.rotate(node.animationMatrix,node.animationMatrix, this.angle*DEGREE_TO_RAD,[0,0,1]);
            }
        }
        // console.log("center ->" +this.center)
        
    }

}