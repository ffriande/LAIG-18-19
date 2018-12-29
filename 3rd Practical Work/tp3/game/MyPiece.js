class MyPiece extends CGFobject{
    constructor(scene, white_black){
        super(scene);
        this.primitives=[];
        this.translation=[];
        this.white_black=white_black; //true if white   
        this.makePiece();
    }
    makePiece(){
            
        this.pieceText = new CGFappearance(this.scene);
        if(this.white_black){
        
            this.pieceText.setAmbient(0.9, 0.9, 0.9, 1);
            this.pieceText.setDiffuse(1, 1, 1, 1);
            this.pieceText.setSpecular(0.1, 0.1, 0.1, 1);
            this.pieceText.setShininess(0.5);
        
        }
        else {
            this.pieceText.setAmbient(0, 0, 0, 1);
            this.pieceText.setDiffuse(0.7, 0.7, 0.7, 1);
            this.pieceText.setSpecular(0.2, 0.2, 0.2, 1);
            this.pieceText.setShininess(0.5);
    }

// this.pieceText.setAmbient(0.1, 0.0, 0.0, 1);
// this.pieceText.setDiffuse(0.7, 0.0, 0.0, 1);
// this.pieceText.setSpecular(0.2, 0.0, 0.0, 1);
// this.pieceText.setShininess(0.5);



    //     if(this.white_black)
    //    //  this.pieceText.loadTexture("scenes/images/white_ivory.jpg");
    //     else 
    //      this.pieceText.loadTexture("scenes/images/black_coiso.jpg");
         
        this.core= new MyCylinderWithBase(this.scene,0.9, 0.8075, 0.7, 40, 40);
        this.torus=new MyTorus(this.scene, 0.14, 0.67, 10, 100);
        this.torus2=new MyTorus(this.scene, 0.135, 0.38, 10, 100);
    }

    //calculo das normais do torus

    setPosition(translate){
        this.translation=translate;
    }

    move(cellId){
        let x1=this.translation[0];
        let z1= this.translation[2];
        let x2=(cellId%10 -1) * this.scene.graph.size_per_cell + this.scene.graph.size_per_cell/2;
        let z2=(Math.trunc(cellId/10)-1) * this.scene.graph.size_per_cell + this.scene.graph.size_per_cell/2;
        let mediumPoint=[(x1+x2)/2,0,(z1+z2)/2];
        let mediumLength=Math.sqrt((x2-x1)^2+(z2-z1)^2)/2;
        console.log(mediumPoint)
        console.log(mediumLength)
    }
    
    display(){
        let index=0;
        let s=this.scene.graph.size_per_cell;
        if(!this.white_black)
            index=2011+(this.translation[2]-s/2)/s*10+(this.translation[0]-s/2)/s;
        else
            index=1011+(this.translation[2]-s/2)/s*10+(this.translation[0]-s/2)/s;
        this.scene.registerForPick(index, this);

        this.scene.pushMatrix();
        this.scene.translate(this.translation[0],this.translation[1],this.translation[2]);
        this.scene.pushMatrix();
        this.scene.rotate(-90*DEGREE_TO_RAD,1,0,0);
        this.pieceText.apply();  
        this.core.display();
        this.scene.pushMatrix();
        this.scene.translate(0,0,0.693);
        this.pieceText.apply();  
        this.torus.display();
        this.scene.translate(0,0,-0.02);
        this.pieceText.apply();  
        this.torus2.display();
        this.scene.popMatrix();
        this.scene.popMatrix();
        this.scene.popMatrix();
    }
}