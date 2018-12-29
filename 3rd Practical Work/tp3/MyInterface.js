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
            newGame: this.new_game,
            game_mode: 0,
            game_level: 0,
            // changeCamera: this.updateCamera,
            // quitServer: this.quitServer,
            scenario: 1,
            // film: this.playFilm,
            scene: this.scene
        };
   
   
        let configFolder = this.gui.addFolder('Configuration');
        configFolder.add(config, 'game_mode', {
            'Human vs Human': 0,
            'Human vs CPU': 1,         
            'CPU vs Human': 2,
            'CPU vs CPU': 3
        }).name('Game Mode');
   
        configFolder.add(config, 'game_level', {
            'Easy': 0,
            'Hard': 1
        }).name('Difficulty');
   
        // configFolder.add(config, 'changeCamera').name('Change Camera');
        // configFolder.add(config, 'film').name('Play Film');
        // configFolder.add(config, 'quitServer').name('Quit Server');
        configFolder.open();
   
        configFolder.add(this.scene, 'scenario', {
             'Normal': 1,
             'Second': 2
        }).name('Scenario');
        configFolder.add(config, 'newGame').name('New Game');
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

    new_game(){
        this.scene.gameMode=this.game_mode;
        this.scene.level=this.level;
        this.scene.startGame();
    }

}