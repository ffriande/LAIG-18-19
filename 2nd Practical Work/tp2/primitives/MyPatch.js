class MyPatch {
    constructor(scene, degreeU, degreeV, controlVertexes) {

        this.scene=scene;
        this.degreeU=degreeU;
        this.degreeV=degreeV;

    
        }

    makeSurface(){
        var nurbsSurface = new CGFnurbsSurface(degreeU,degreeV,controlPoints);

        this.surface = new CGFnurbsObject(scene,nurbsSurface,20,20);

    }

}
