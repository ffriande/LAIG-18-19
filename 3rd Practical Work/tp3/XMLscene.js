var DEGREE_TO_RAD = Math.PI / 180;
var BOARD_SIZE=8;

/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
        this.lightValues = {};
        this.selectables = [];
        this.views = " ";

        this.lastTime = 0;
        
        this.scenario=0;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.before_updateTime = -1;

        this.setUpdatePeriod(1000 / 60);

        this.setPickEnabled(true);
        //this.updateUniformValues();
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4,0.1,500,vec3.fromValues(15, 15, 15),vec3.fromValues(0, 0, 0));
    }
    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;
            // Only eight lights allowed by WebGL.

            if (this.graph.lights.hasOwnProperty(key)) {
                var light = this.graph.lights[key];

                if (light.length > 5) {
                    this.lights[i].setPosition(light[3][0], light[3][1], light[3][2], light[3][3]);
                    this.lights[i].setAmbient(light[5][0], light[5][1], light[5][2], light[5][3]);
                    this.lights[i].setDiffuse(light[6][0], light[6][1], light[6][2], light[6][3]);
                    this.lights[i].setSpecular(light[7][0], light[7][1], light[7][2], light[7][3]);
                    this.lights[i].setSpotDirection(light[4][0], light[4][1], light[4][2]);
                    this.lights[i].setSpotCutOff(light[1]);
                    this.lights[i].setSpotExponent(light[2]);
                } else {
                    this.lights[i].setPosition(light[1][0], light[1][1], light[1][2], light[1][3]);
                    this.lights[i].setAmbient(light[2][0], light[2][1], light[2][2], light[2][3]);
                    this.lights[i].setDiffuse(light[3][0], light[3][1], light[3][2], light[3][3]);
                    this.lights[i].setSpecular(light[4][0], light[4][1], light[4][2], light[4][3]);
                }

                this.lights[i].setVisible(true);
                if (light[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /* Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.camera = this.graph.views[this.graph.default];
        this.interface.setActiveCamera(this.camera);
        //              this.camera.near = this.graph.near;
        //              this.camera.far = this.graph.far;

        //             if(this.graph.views[0] == 'perspective'){
        //                  this.camera.fov=this.graph.views[4];
        //                  this.camera.position=this.graph.views[5];
        //                  this.camera.target=this.graph.views[6];
        //             }

        //         else if(this.graph.views[0] == 'ortho'){
        //             this.camera= new CGFcameraOrtho(this.graph.views[4],this.graph.views[5],this.graph.views[7],this.graph.views[6], this.graph.near,this.graph.far, this.graph.views[8],this.graph.views[9]);
        //         }

        console.log(this.camera.position);

        // Change reference length according to parsed graph
        this.axis = new CGFaxis(this,this.graph.axis_length);

        // Change ambient and background details according to parsed graph
        this.setGlobalAmbientLight(this.graph.ambient[0], this.graph.ambient[1], this.graph.ambient[2], this.graph.ambient[3]);
        this.gl.clearColor(this.graph.background[0], this.graph.background[1], this.graph.background[2], this.graph.background[3]);

        this.initLights();

        // Adds lights group.
        this.interface.addLightsGroup(this.graph.lights);

        //Adds views group
        this.interface.addSelectDropDown(this.graph.viewsIDs);

        
        this.interface.addOptionsGroup();
        this.sceneInited = true;
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        if (this.sceneInited) {

            // Draw axis
            this.axis.display();

            var i = 0;
            for (var key in this.lightValues) {
                if (this.lightValues.hasOwnProperty(key)) {
                    if (this.lightValues[key]) {
                        this.lights[i].setVisible(true);
                        this.lights[i].enable();
                    } else {
                        this.lights[i].setVisible(false);
                        this.lights[i].disable();
                    }
                    this.lights[i].update();
                    i++;
                }
            }

            // displays and handles picking.

	        this.logPicking();
	        this.clearPickRegistration();
            this.graph.displayScene();
            
            

        } else {
            // Draw axis
            this.axis.display();
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }

    /**
     * Switches primitives materials when 'M' or 'm' keys are pushed. This function is called by MyInterface.
     */
    changeMaterials() {
        for (var item in this.graph.nodes) {
            this.graph.nodes[item].activeMaterial = this.graph.nodes[item].materials[this.graph.nodes[item].materials.indexOf(this.graph.nodes[item].activeMaterial) + 1]
            if (this.graph.nodes[item].activeMaterial == null)
                this.graph.nodes[item].activeMaterial = this.graph.nodes[item].materials[0];
        }
    }

    /**
     * Switches camera to id=select.This function is called by MyInterface.
     * @param {String} select
     */
    setNewCamera(select) {
        this.camera = this.graph.views[select];
        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Returns default camera.
     */
    getDefaultView() {
        return this.graph.default;
    }

    /**
     * Updates the entire scene.
     * @param {float} currTime
     */
    update(currTime) {

        //  this.time = (Math.cos(currTime/1000))/ 2 + 0.5;
        if (this.before_updateTime == -1)
            this.graph.update(0);
        else
            this.graph.update(currTime - this.before_updateTime);

        this.before_updateTime = currTime;

        this.updateUniformValues(currTime);
    }

    logPicking() {

        if (this.pickMode == false) {
            if (this.pickResults != null && this.pickResults.length > 0) {
                for (var i = 0; i < this.pickResults.length; i++) {
                    var obj = this.pickResults[i][0];
                    if (obj) {
                        var customId = this.pickResults[i][1];
                        console.log("Picked object: " + obj + ", with pick id " + customId);
                    }
                }
                this.pickResults.splice(0, this.pickResults.length);
            }
        }
    }

    updateUniformValues(date) {//         for(var i=0;i<this.graph.shaders.length;i++)
    //             this.graph.shaders[i].setUniformsValues({timeFactor: date});
    }
    ;
}
