class MyShaderTerrain extends CGFobject {

    constructor(scene, texture, heightmap, parts, heightscale){
    
    super(scene);
    
    this.texture = texture;
    this.heightmap = heightmap;
    
    this.parts = parts;
    
    this.heightscale = heightscale;
    
    this.init();
    
    }

    
    /**
     * initiates shader, links vertex and fragment files , sets uniform values and creates shader's plane.
     */
    init(){
        
        this.shader = new CGFshader(this.scene.gl, "shaders/vertShader.vert", "shaders/fragShader.frag");
        this.shader.setUniformsValues({text :0});
        this.shader.setUniformsValues({height: 1});
        this.shader.setUniformsValues({heightscale: this.heightscale});

        this.plane = new MyPlane(this.scene, this.parts,this.parts);
    }
    
    /**
     * Shader display function. Binds textures.
     */
    display()
    {
    
    this.scene.setActiveShader(this.shader);
    this.texture.bind(0);
    
    this.heightmap.bind(1);
    
    this.plane.display();
    
    this.scene.setActiveShader(this.scene.defaultShader);
    
    };
};