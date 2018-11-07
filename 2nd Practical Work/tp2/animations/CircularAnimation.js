/**
 * CircularAnimation
 * @constructor
 */
class CircularAnimation extends Animation
{
    constructor(time, center, radius, init_ang, rot_ang) {

        super(time);
        this.center = center;
        this.radius = radius;
        this.init_ang = init_ang*DEGREE_TO_RAD;
        this.rot_ang = rot_ang*DEGREE_TO_RAD;
        this.totalDistance = radius*rot_ang;
        this.speed=this.totalDistance/this.time;
    }

    update(deltaT){
        this.distanceCovered = this.speed * deltaT;

        // calculate turning angle
        this.angle = this.init_ang + this.distanceCovered/this.radius;
        
    }

    apply(node){
        mat4.identity(node.animationMatrix);

    	mat4.translate(node.animationMatrix,node.animationMatrix, this.center);
		
		//mat4.translate(node.animationMatrix, node.animationMatrix, [this.radius, 0, 0]);		
		
 		mat4.rotateX(node.animationMatrix,node.animationMatrix, this.angle*DEGREE_TO_RAD);

    }

}