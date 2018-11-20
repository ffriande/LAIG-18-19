class MyPlane{
    constructor(scene, degreeU, degreeV){
    	this.scene=scene;
        this.degreeU=degreeU;
        this.degreeV=degreeV;
//      this.findControlVertexes();
		this.controlvertexes = [	// U = 0
							[ // V = 0..1;
								 [-0.5, 0, 0.5, 1 ],
								 [-0.5, 0, -0.5, 1 ]
								
							],
							// U = 1
							[ // V = 0..1
								 [ 0.5, 0, 0.5, 1 ],
								 [ 0.5, 0, -0.5, 1 ]							 
							]
						];
        this.makeSurface();
    }

   /* findControlVertexes(){
        this.controlvertexes=[];

        for(var i=0;i<=this.degreeU;i++){
            var v_vertexes=[]
            for(var j=0;j<=this.degreeV;j++){
                v_vertexes.push([(-0.5+i/this.degreeU),0,(0.5-j/this.degreeV),1]);
            }
            this.controlvertexes.push(v_vertexes);
        }
    }*/

    makeSurface() {
			
		var nurbsSurface = new CGFnurbsSurface(1, 1, this.controlvertexes);

		this.surface = new CGFnurbsObject(this.scene, this.degreeU, this.degreeV, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}
}