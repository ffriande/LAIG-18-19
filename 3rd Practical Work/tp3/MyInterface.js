/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        // add a group of controls (and open/expand by defult)

        return true;
    }
        /**
     * Adds a folder containing the options of the game.
     */
    addOptionsGroup() {
        let config = {
            // newGame: this.requestNewConfig,
            gameMode: 0,
            gameLevel: 0,
            // changeCamera: this.updateCamera,
            // quitServer: this.quitServer,
            // theme: THEME.LEGACY,
            // film: this.playFilm,
            scene: this.scene
        };
   
   
        let configFolder = this.gui.addFolder('Configuration');
        configFolder.add(config, 'gameMode', {
            'Human vs Human': 0,
            'Human vs CPU': 1,
            'CPU vs CPU': 2
        }).name('Game Mode');
   
        configFolder.add(config, 'gameLevel', {
            'Easy': 0,
            'Hard': 1
        }).name('Difficulty');
   
   
        // configFolder.add(config, 'newGame').name('New Game');
        // configFolder.add(config, 'changeCamera').name('Change Camera');
        // configFolder.add(config, 'film').name('Play Film');
        // configFolder.add(config, 'quitServer').name('Quit Server');
        configFolder.open();
   
        configFolder.add(this.scene, 'scenario', {
             'Normal': 1,
             'Second': 2
        }).name('Scenario');
    }
    /**
     * Adds a folder containing the IDs of the lights passed as parameter.
     * @param {array} lights
     */
    addLightsGroup(lights) {

        var group = this.gui.addFolder("Lights");
        group.open();

        // add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
        // e.g. this.option1=true; this.option2=false;

        for (var key in lights) {
            if (lights.hasOwnProperty(key)) {
                this.scene.lightValues[key] = lights[key][0];
                group.add(this.scene.lightValues, key);
            }
        }
    }

     /**
     * processKeyboard
     * @param event {Event}
     */
     processKeyboard(event){
     switch (event.keyCode)
	   {
	    case (109):	// only works for lower 'm', as it is
			this.scene.changeMaterials();
			break;
		case (77):	// only works for capital 'M', as it is
			this.scene.changeMaterials();
			break;
	   }
    }
    
    /**
     * addSelectDropDown
     * @param selectables {selectables}
     */
    addSelectDropDown(selectables){
    	var scene=this.scene;
       selectables.splice(0, 0, " ");
        var group = this.gui.add(scene, 'views', selectables);
        group.onFinishChange(function(value){
            scene.setNewCamera(value);
        });
    }

}