class MyPatch {
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlVertexes) {

        this.scene=scene;
        this.npointsU=npointsU;
        this.npointsV=npointsV;
        this.npartsU=npartsU;
        this.npartsV=npartsV;
        this.separate_controlPoints(controlVertexes);
        this.makeSurface();
        }

    separate_controlPoints(controlVertexes){
        var index=0;
        this.controlPoints=[];
        for(let i=0; i<this.npointsU;i++){
            let vn=[];
            for(let k = 0; k< this.npointsV;k++){
                vn.push(controlVertexes[index]);
                vn[k].push(1);
                index++;    
            }
            this.controlPoints.push(vn);
        }
    }

    makeSurface(){
        var nurbsSurface = new CGFnurbsSurface(this.npointsU-1,this.npointsV-1,this.controlPoints);

        this.surface = new CGFnurbsObject(this.scene,this.npartsU,this.npartsV,nurbsSurface);
    }

}
