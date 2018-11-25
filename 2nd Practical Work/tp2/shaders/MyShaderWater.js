class MyShaderWater extends CGFobject {

    constructor(scene, texture, wavemap, parts, heightscale,texscale){
    
    super(scene);
    
    this.texture = texture;
    this.wavemap = wavemap;
    
    this.parts = parts;
    
    this.heightscale = heightscale;

    this.texscale=texscale;
    
    this.init();
    
    }

    init(){
        
        this.shader = new CGFshader(this.scene.gl, "shaders/vertWater.vert", "shaders/fragWater.frag");

        this.shader.setUniformsValues({date:Date.now()}); //nao meu
        this.shader.setUniformsValues({text :0});
        this.shader.setUniformsValues({heightmap: 1});
        this.shader.setUniformsValues({heightscale: this.heightscale});

        this.plane = new MyPlane(this.scene, this.parts,this.parts);
    }
    
    display()
    {
    
    this.scene.setActiveShader(this.shader);
    var time = Math.sin(Date.now() * 0.00001) * 20;  ///nao meu
    this.shader.setUniformsValues({timeFactor:time,heightmap: 1}); ///nao meu

    this.texture.bind(0);
    
    this.wavemap.bind(1);
    
    this.plane.display();
    
    this.scene.setActiveShader(this.scene.defaultShader);
    
    };
};