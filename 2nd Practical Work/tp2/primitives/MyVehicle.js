class MyVehicle extends CGFobject{
    constructor(scene){
        super(scene);
        this.primitives=[];
        this.makewing();
        this.makebody();
        this.makebeak();
        this.maketail();
        this.makeeyes();




    this.bodytex = new CGFappearance(this.scene);
    this.bodytex.setAmbient(0.3, 0.3, 0.3, 1);
    this.bodytex.setDiffuse(0.9, 0.9, 0.9, 1);
    this.bodytex.setSpecular(0.1, 0.1, 0.1, 1);
    this.bodytex.setShininess(10);
    this.bodytex.loadTexture("scenes/images/feathers.jpg");
    
    this.feathertex = new CGFappearance(this.scene);
    this.feathertex.setAmbient(0.3, 0.3, 0.3, 1);
    this.feathertex.setDiffuse(0.9, 0.9, 0.9, 1);
    this.feathertex.setSpecular(0.1, 0.1, 0.1, 1);
    this.feathertex.setShininess(10);
    this.feathertex.loadTexture("scenes/images/feather.jpg");
    
    this.beaktex = new CGFappearance(this.scene);
    this.beaktex.setAmbient(0.3, 0.3, 0.3, 1);
    this.beaktex.setDiffuse(0.9, 0.9, 0.9, 1);
    this.beaktex.setSpecular(0.1, 0.1, 0.1, 1);
    this.beaktex.setShininess(10);
    this.beaktex.loadTexture("scenes/images/beak.jpg");

       
    }

    makewing(){

        this.base=1;
        this.top=4;
        this.height=5;
        var wing1 = 
       
  
        [ 
            [    
                 [this.base/2, 0,   0,    1],
                 [this.base/2,  -0.7*this.base,  0,  1],
                 [-this.base/2,  - 0.7*this.base,   0 , 1],
                 [-this.base/2,  0,   0,  1] ,          

            ],

            [
                 [this.top/2,   this.height,  0,  1],
                 [this.top/2,   this.height,  0.7*this.top,  1],
                 [-this.top/2,  this.height,  0.7*this.top,  1],
                 [-this.top/2,  this.height,  0,  1]
            ],
       ];

      this.top=4.2;
      var wing2=
      [ 
            [    
                 [-this.base/2, 0,   0,    1],
                 [-this.base/2,  -0.7*this.base,  0,  1],
                 [this.base/2,  - 0.7*this.base,   0 , 1],
                 [this.base/2,  0,   0,  1] ,          

            ],

            [
                 [-this.top/2,   this.height,  0,  1],
                 [-this.top/2,   this.height,  0.7*this.top,  1],
                 [this.top/2,  this.height,  0.7*this.top,  1],
                 [this.top/2,  this.height,  0,  1]
            ],
       ];

        var nurbsSurface1 = new CGFnurbsSurface(1,3,wing1);
        this.surface1 = new CGFnurbsObject(this.scene,20,20,nurbsSurface1);


       var nurbsSurface2 = new CGFnurbsSurface(1,3,wing2);
        this.surface2 = new CGFnurbsObject(this.scene,20,20,nurbsSurface2);
    }
    
    makebody(){
        this.body1=new MySphere(this.scene,2,30,30);
    }

    makebeak(){
        
var beak = 
       
  
       [ 
           [    
                [-1, -1,   -1,    1],
                [1 , 1,  0,   Math.sqrt(2)/2],
                [0,   1,   0 , 1],    

           ],

           [
                
            [0, 0,   0,    1],
            [0, 1,  1,  Math.sqrt(2)/2],
            [1,   1,   1, 1],    
            
           ],
           [
                  
            [-1, -1,   -1,    1],
            [1, 0, 1,  Math.sqrt(2)/2],
            [0,  0,   1, 1],   
           ]
      ];
    var nurbsSurface = new CGFnurbsSurface(2,2,beak);
    this.beak1 = new CGFnurbsObject(this.scene,20,20,nurbsSurface);


    }

    maketail(){
    var feather=  [ 
           [    
                [0, 0,   0,    1],
                [1 , 1,  0,   Math.sqrt(2)/2],
                [1,   1,  1 , 1],    

           ],

           [
                
            [0, 0,   0,    1],
            [0, 1,  1,  Math.sqrt(2)/2],
            [1,   1,   1, 1],    
           ],
           [
                  
            [0, 0,   0,    1],
            [1, 0, 1,  Math.sqrt(2)/2],
            [1,  1,   1, 1],   
           ]
      ];
          var nurbsSurface = new CGFnurbsSurface(2,2,feather);
    this.feather = new CGFnurbsObject(this.scene,20,20,nurbsSurface);

    }
    
    makeeyes(){
        this.eye=new MySphere(this.scene,0.4,20,20);
    }
    display(){
        //wing test
        this.scene.pushMatrix();
        
        this.scene.pushMatrix();
        this.scene.rotate(90*DEGREE_TO_RAD,1,0,0);
        this.scene.rotate(-180*DEGREE_TO_RAD,0,1,0);
        this.scene.rotate(180*DEGREE_TO_RAD,0,0,1);
        this.scene.scale(0.2,0.2,0.1);
   
      

        this.scene.pushMatrix();
        this.scene.translate(0,-5.8,0);
        this.scene.scale(1,1,0.9);
        this.bodytex.apply();  
        this.surface1.display();
        this.scene.rotate(-7*DEGREE_TO_RAD,1,0,0);
        this.feathertex.apply();  
        this.surface2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        
        this.scene.rotate(180*DEGREE_TO_RAD,0,0,1); 
        this.scene.translate(0,-5.8,0);

        this.scene.scale(1,1,0.9);
        this.bodytex.apply();  
        this.surface1.display();
        this.scene.rotate(-7*DEGREE_TO_RAD,1,0,0);
        this.bodytex.apply();    
        this.surface2.display();
        this.scene.popMatrix();

        //body1
        
        this.scene.pushMatrix();
        this.scene.translate(-0.3,0,0);
        this.scene.rotate(90*DEGREE_TO_RAD,0,1,0); 
        this.scene.scale(1,1,2.5);
        this.body1.display();        
        this.scene.popMatrix();

        //head
        this.scene.pushMatrix();  
        this.scene.translate(3.4,0,0);
        this.scene.scale(0.85,0.85,0.85);
                this.feathertex.apply();  
        this.body1.display();      
        this.scene.popMatrix();
        
        //beak
        this.scene.pushMatrix();
        this.scene.translate(5.35,0,0);
        this.scene.rotate(-241*DEGREE_TO_RAD,1,0,0);
        this.scene.rotate(215*DEGREE_TO_RAD,0,1,0); 
        this.scene.rotate(-45*DEGREE_TO_RAD,0,0,1); 
        this.beaktex.apply();
        this.beak1.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();

        this.scene.translate(5.35,0,-0.2);
        this.scene.rotate(-180*DEGREE_TO_RAD,1,0,0);
        this.scene.rotate(-241*DEGREE_TO_RAD,1,0,0);
        this.scene.rotate(215*DEGREE_TO_RAD,0,1,0); 
        this.scene.rotate(-40*DEGREE_TO_RAD,0,0,1); 
        this.beaktex.apply(); 
        this.beak1.display();
        this.scene.popMatrix();


        //feather
        this.scene.pushMatrix();  
        this.scene.translate(-6,0,0.4);
        this.scene.rotate(30*DEGREE_TO_RAD,0,1,0);
        this.scene.rotate(40*DEGREE_TO_RAD,1,0,0);
        this.scene.rotate(-5*DEGREE_TO_RAD,0,0,1);
        this.scene.scale(2,2,2);
         this.feathertex.apply();
        this.feather.display();    
        this.scene.translate(0,0.5,0);  
        this.scene.rotate(-10*DEGREE_TO_RAD,0,0,1);
        this.feather.display();    
        this.scene.translate(0,0.5,0);  
        this.scene.rotate(-15*DEGREE_TO_RAD,0,0,1);
        this.feather.display();     

        this.scene.popMatrix();


         this.scene.pushMatrix();  
        this.scene.translate(-7,0,0.4);
        this.scene.rotate(30*DEGREE_TO_RAD,0,1,0);
        this.scene.rotate(40*DEGREE_TO_RAD,1,0,0);
        this.scene.rotate(-15*DEGREE_TO_RAD,0,0,1);
        this.scene.scale(2,3,2);
        this.feather.display();   

        this.scene.popMatrix();

         this.scene.pushMatrix();  
        this.scene.translate(-7,-0.9,0.5);
        this.scene.rotate(30*DEGREE_TO_RAD,0,1,0);
        this.scene.rotate(45*DEGREE_TO_RAD,1,0,0);
        this.scene.rotate(-15*DEGREE_TO_RAD,0,0,1);
        this.scene.scale(2,3,2);

        this.feather.display();   
        this.scene.popMatrix();
                
         this.scene.pushMatrix();  
        this.scene.translate(-7.6,-0.4,0.5);
        this.scene.rotate(35*DEGREE_TO_RAD,0,1,0);
        this.scene.rotate(45*DEGREE_TO_RAD,1,0,0);
        this.scene.rotate(-15*DEGREE_TO_RAD,0,0,1);
        this.scene.scale(2,3,2);

        this.feather.display();   
        this.scene.popMatrix();

                this.scene.pushMatrix();  
        this.scene.translate(-5.5,-1.5,0.8);
        this.scene.rotate(30*DEGREE_TO_RAD,0,1,0);
        this.scene.rotate(18*DEGREE_TO_RAD,1,0,0);
        this.scene.rotate(-5*DEGREE_TO_RAD,0,0,1);
        this.scene.scale(2,2,2);
        this.feather.display();    


        this.scene.popMatrix();
        this.scene.popMatrix();

        this.scene.popMatrix();

        
    }
}