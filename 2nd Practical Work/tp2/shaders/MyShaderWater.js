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

    /**
     * initiates shader, links vertex and fragment files , sets uniform values and creates shader's plane.
     */
    init(){
        
        this.shader = new CGFshader(this.scene.gl, "shaders/vertWater.vert", "shaders/fragWater.frag");

        this.shader.setUniformsValues({date:Date.now()}); 
        this.shader.setUniformsValues({text :0});
        this.shader.setUniformsValues({heightmap: 1});
        this.shader.setUniformsValues({heightscale: this.heightscale});

        this.plane = new MyPlane(this.scene, this.parts,this.parts);
    }
    
    
    /**
     * Shader display function, in which time factor is set and textures binded.
     */
    display()
    {
    
    this.scene.setActiveShader(this.shader);
    var time = Math.sin(Date.now() * 0.00001) * 20;  
    this.shader.setUniformsValues({timeFactor:time,heightmap: 1});

    this.texture.bind(0);
    
    this.wavemap.bind(1);
    
    this.plane.display();
    
    this.scene.setActiveShader(this.scene.defaultShader);
    
    };
};