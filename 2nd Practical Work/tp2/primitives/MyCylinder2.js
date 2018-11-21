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
       
	this.controlPoints = [
            [
                [-this.base / 2, 0.0, 0.0, 1.0],
                [-this.base / 2, Math.sqrt(2)*this.base / 2, 0.0, 1.0],
                [this.base / 2, Math.sqrt(2)*this.base / 2, 0.0, 1.0],
                [this.base / 2, 0.0, 0.0, 1.0]
            ],
            [
                [-this.top / 2, 0.0, this.height, 1.0],
                [-this.top / 2, Math.sqrt(2)*this.top / 2, this.height, 1.0],
                [this.top / 2, Math.sqrt(2)*this.top / 2, this.height, 1.0],
                [this.top / 2, 0.0, this.height, 1.0]
            ]
        ];

        let controlPointsSequel = [
            [
                [this.base / 2, 0.0, 0.0, 1.0],
                [this.base / 2, -this.base * Math.sqrt(2)/ 2, 0.0, 1.0],
                [-this.base / 2, -this.base* Math.sqrt(2) / 2, 0.0, 1.0],
                [-this.base / 2, 0.0, 0.0, 1.0]
            ],
            [
                [this.top / 2, 0.0, this.height, 1.0],
                [this.top / 2, -this.top* Math.sqrt(2) / 2, this.height, 1.0],
                [-this.top / 2, -this.top* Math.sqrt(2) / 2, this.height, 1.0],
                [-this.top / 2, 0.0, this.height, 1.0]
            ]
        ];
						      
   }

    makeSurfaces(){
        var nurbsSurface1 = new CGFnurbsSurface(1,3,this.controlPoints);

        this.surface1 = new CGFnurbsObject(this.scene,this.slices,this.stacks,nurbsSurface1);
       

        var nurbsSurface2 = new CGFnurbsSurface(1,3,this.controlPoints);

        this.surface2 = new CGFnurbsObject(this.scene,this.slices,this.stacks,nurbsSurface2);
        

        //TODO: juntar duas faces??
        //slices e stacks ordem certa?
    }

    display(){
        this.scene.pushMatrix();
        this.surface1.display();
        this.scene.rotate(180*DEGREE_TO_RAD,0,0,1);
        this.surface2.display();
        this.scene.popMatrix();
    }
}

