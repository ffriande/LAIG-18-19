/**
 * MyCylinderWithBase
 * @constructor
 */

class MyCylinderWithBase extends CGFobject {

    constructor(scene, base, top, height, slices, stacks) {

        super(scene);
    
        this.height = height;
        this.top=top;
        this.base=base;
        this.body = new MyCylinder(this.scene, base, top, height, slices, stacks);
        this.body.initBuffers();

        this.circle = new MyCircle(this.scene,slices);
        this.circle.initBuffers();

    };


    display() {

        //Cylinder body
        this.scene.pushMatrix();
            this.body.display();
        this.scene.popMatrix();
        
        //Cylinder top
        this.scene.pushMatrix();
            this.scene.translate(0,0,this.height);
            this.scene.scale(this.top,this.top,1);
            this.circle.display();
        this.scene.popMatrix();
        
        //Cylinder bot
        this.scene.pushMatrix();
            this.scene.rotate(180 * DEGREE_TO_RAD,1,0,0);
            this.scene.scale(this.base,this.base,1);
            this.circle.display();
        this.scene.popMatrix();

    };

};