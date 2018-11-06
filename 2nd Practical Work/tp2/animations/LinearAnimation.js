class LinearAnimation extends Animation {

    constructor(time, control_points) {

        super(time);
        this.control_points = control_points;
        this.totalDistance = 0;
        this.distanceStacks = [];
        
        //calculates distance between points
        var i = 0;
        for (;i< this.control_points.length - 1; i++) {
            var aux = this.calculateNorm(this.control_points[i], this.control_points[i + 1]);
            this.distanceStacks.push(aux);
            this.totalDistance+=aux;
        }

        this.speed=this.totalDistance/this.time;
    }

    update(deltaT){
        this.distanceCovered = this.speed * deltaT;
        this.initTranslation =[0,0,0];

		// find current segment
        var i = 0;
        while (this.distanceCovered > this.distanceStacks[i] && i < this.distanceStacks.length){
            this.distanceCovered -= this.distanceStacks[i];
            this.initTranslation = this.control_points[i+1];
            i++;
        }

        // get control points from current segment
        this.p1 = this.control_points[i];
        this.p2 = this.control_points[i + 1];

        // calculate displacement 
        this.relativeDistance = this.distanceCovered/this.distanceStacks[i];

        // calculate rotation angle
        this.angle = this.angleBetween([0,0,1],this.subtractPoints(this.control_points[i],this.control_points[i+1]));
        
    }

    apply(node){
        mat4.identity(node.animationMatrix);

    	mat4.translate(node.animationMatrix,node.animationMatrix, this.initTranslation);
		
		mat4.translate(node.animationMatrix, node.animationMatrix, 
		[(this.p2[0] - this.p1[0]) * this.relativeDistance ,
		 (this.p2[1] - this.p1[1]) * this.relativeDistance, 
		 (this.p2[2] - this.p1[2]) * this.relativeDistance ]);		
		
 		mat4.rotateY(node.animationMatrix,node.animationMatrix, this.angle);

    }

}
