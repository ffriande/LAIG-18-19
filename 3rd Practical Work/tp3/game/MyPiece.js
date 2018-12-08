class MyPiece extends CGFobject{
    constructor(scene){
        super(scene);
        this.primitives=[];
        this.translation=[];
        this.makePiece();
    }
    makePiece(){
        this.core= new MyCylinderWithBase(this.scene,0.9, 0.8075, 0.7, 40, 40);
        this.torus=new MyTorus(this.scene, 0.14, 0.67, 10, 100);
        this.torus2=new MyTorus(this.scene, 0.135, 0.38, 10, 100);
    }

    setPosition(translate){
        this.translation=translate;
    }
    
    display(){
        this.scene.pushMatrix();  
        this.scene.translate(this.translation[0],this.translation[1],this.translation[2]);
        this.scene.pushMatrix();
        this.scene.rotate(-90*DEGREE_TO_RAD,1,0,0);
        this.core.display();
        this.scene.pushMatrix();
        this.scene.translate(0,0,0.693);
        this.torus.display();
        this.scene.translate(0,0,-0.02);
        this.torus2.display();
        this.scene.popMatrix();
        this.scene.popMatrix();
        this.scene.popMatrix();
    }
}