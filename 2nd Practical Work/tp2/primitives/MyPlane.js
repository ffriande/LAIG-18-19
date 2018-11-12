class MyPlane{
    constructor(degreeU, degreeV){
        this.degreeU=degreeU;
        this.degreeV=degreeV;
    }

    findControlVertexes(){
        this.controlvertexes=[];

        for(var i=0;i<=this.degreeU;i++){
            var v_vertexes=[]
            for(var j=0;j<=this.degreeV;j++){
                v_vertexes.push([(-0.5+i/this.degreeU),0,(0.5-j/this.degreeV),1]);
            }
            this.controlvertexes.push(v_vertexes);
        }
    }

    makeSurface() {
			
		var nurbsSurface = new CGFnurbsSurface(degreeU, degreeV, this.controlvertexes);

		this.surface = new CGFnurbsObject(this, 20, 20, nurbsSurface ); // must provide an object with the function getPoint(u, v) (CGFnurbsSurface has it)
	}
}