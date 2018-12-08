class MyCell extends CGFobject{
    constructor(scene, size, x, z,mat){
        super(scene);
        this.mat=mat;
		this.controlvertexes = [	// U = 0
							[ // V = 0..1;	
								 [ size+x, 0, z, 1 ],
								 [ x+size, 0, z+size, 1 ]						
							],
							// U = 1
							[ // V = 0..1
								 [x, 0, z, 1 ],
								 [x, 0, size+z, 1 ]								 
							]
						];
						
		console.log(this.controlvertexes);
    	var nurbsSurface = new CGFnurbsSurface(1, 1, this.controlvertexes);

		this.surface = new CGFnurbsObject(this.scene, 20, 20, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	

		
			    this.mat1 = new CGFappearance(this.scene);
				this.mat1.setAmbient(0.3, 0.3, 0.3, 1);
				this.mat1.setDiffuse(0.9, 0.9, 0.9, 1);
				this.mat1.setSpecular(0.1, 0.1, 0.1, 1);
				this.mat1.setShininess(10);


			    this.mat2 = new CGFappearance(this.scene);
				this.mat2.setAmbient(0.9, 0.9, 0.9, 1);
				this.mat2.setDiffuse(0.9, 0.9, 0.9, 1);
				this.mat2.setSpecular(0.1, 0.1, 0.1, 1);
				this.mat2.setShininess(10);
	}

	display(){
		if(this.mat==1)
			this.mat1.apply();
		else this.mat2.apply();
		this.surface.display();
	}
}