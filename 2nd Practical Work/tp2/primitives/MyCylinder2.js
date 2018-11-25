class MyCylinder2{
    constructor(scene, base, top, height, stacks, slices) {
        this.scene=scene;
        this.base=base;
        this.top=top;
        this.height = height;
        this.stacks=stacks;
        this.slices = slices;
        this.calculateControlPoints();
        this.makeSurfaces();
}
   
   calculateControlPoints(){
       
	this.controlPoints = 
	       [ 
                [
                     [-this.base/2, 0,   0,    1],
                     [-this.base/2,  0.7*this.base,  0,  1],
                     [this.base/2,   0.7*this.base,   0 , 1],
                     [this.base/2,  0,   0,  1]
                ],

                [
                     [-this.top/2,   0,  this.height,  1],
                     [-this.top/2,  0.7*this.top, this.height,    1],
                     [this.top/2, 0.7*this.top, this.height,    1],
                     [this.top/2, 0, this.height,    1]
                ],
           ];

        //   let controlPoints = [ [-this.top / 2, 0.0, this.height, 1.0], [-this.top / 2, Math.sqrt(2)*this.top / 2, this.height, 1.0], [this.top / 2, Math.sqrt(2)*this.top / 2, this.height, 1.0], [this.top / 2, 0.0, this.height, 1.0] ] ];
           
   }

    makeSurfaces(){
        var nurbsSurface1 = new CGFnurbsSurface(1,3,this.controlPoints);

        this.surface1 = new CGFnurbsObject(this.scene,this.slices,this.stacks,nurbsSurface1);
       

        var nurbsSurface2 = new CGFnurbsSurface(1,3,this.controlPoints);

        this.surface2 = new CGFnurbsObject(this.scene,this.slices,this.stacks,nurbsSurface2);

    }

    display(){
        this.scene.pushMatrix();
        this.surface1.display();
        this.scene.rotate(180*DEGREE_TO_RAD,1,0,0);      
        this.scene.rotate(180*DEGREE_TO_RAD,0,1,0);
        this.surface2.display();
        this.scene.popMatrix();
    }
}

