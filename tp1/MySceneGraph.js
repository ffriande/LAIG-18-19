var DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var SCENE_INDEX = 0;
var VIEWS_INDEX = 1;
var AMBIENT_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var TRANSFORMATIONS_INDEX = 6;
var PRIMITIVES_INDEX = 7;
var COMPONENTS_INDEX = 8;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * @constructor
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.nodes = [];

        this.idRoot = null;                    // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */

        this.reader.open('scenes/' + filename, this);
    }


    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "yas")
            return "root tag <yas> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <scene>
        var index;
        if ((index = nodeNames.indexOf("scene")) == -1)
            return "tag <scene> missing";
        else {
            if (index != SCENE_INDEX)
                this.onXMLMinorError("tag <scene> out of order");

            //Parse scene block
            if ((error = this.parseScene(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <ambient>
        if ((index = nodeNames.indexOf("ambient")) == -1)
            return "tag <ambient> missing";
        else {
            if (index != AMBIENT_INDEX)
                this.onXMLMinorError("tag <ambient> out of order");

            //Parse ambient block
            if ((error = this.parseAmbient(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }

        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <transformations>
        if ((index = nodeNames.indexOf("transformations")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != TRANSFORMATIONS_INDEX)
                this.onXMLMinorError("tag <transformations> out of order");

            //Parse transformations block
            if ((error = this.parseTransformations(nodes[index])) != null)
                return error;
        }

        // <primitives>
        if ((index = nodeNames.indexOf("primitives")) == -1)
            return "tag <primitives> missing";
        else {
            if (index != PRIMITIVES_INDEX)
                this.onXMLMinorError("tag <primitives> out of order");

            //Parse primitives block
            if ((error = this.parsePrimitives(nodes[index])) != null)
                return error;
        }

        // <components>
        if ((index = nodeNames.indexOf("components")) == -1)
            return "tag <transformations> missing";
        else {
            if (index != COMPONENTS_INDEX)
                this.onXMLMinorError("tag <components> out of order");

            //Parse components block
            if ((error = this.parseComponents(nodes[index])) != null)
                return error;
        }
    }

    /**
     * Parses the <scene> block.
     */
    parseScene(sceneNode) {
        this.root = this.reader.getString(sceneNode, 'root');
        this.axis_length = this.reader.getFloat(sceneNode, 'axis_length');

        if (!(this.root != null || this.root != "")) {
                this.root = "n1";
                this.onXMLMinorError("unable to parse value for root; assuming 'root = n1");
            }
            else if (!(this.axis_length != null && !isNaN(this.axis_length))) {
                this.axis_length = 5;
                this.onXMLMinorError("unable to parse value for far axis length; assuming 'axis_length = 5'");
            }
    }

     /**
     * Parses the <views> node.
     * @param {lights block element} lightsNode
     */
    parseViews(viewsNode) {

        var children = viewsNode.children;

        this.default = this.reader.getString(viewsNode, 'default');

        this.views = [];
        var numViews = 0;

        var grandChildren = [];
        var nodeNames = [];

        // One or two views.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "perspective" && children[i].nodeName != "ortho") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current view.
            var viewId = this.reader.getString(children[i], 'id');
            if (viewId == null)
                return "no ID defined for view";

            // Checks for repeated IDs.
            if (this.views[viewId] != null)
                return "ID must be unique for each view (conflict: ID = " + viewId + ")";

            var near = this.reader.getFloat(children[i], 'near');
            if (!(near != null && !isNaN(near)))
                return "unable to parse near value of the view for ID = " + viewId;

            var far = this.reader.getFloat(children[i], 'far');
            if (!(far != null && !isNaN(far)))
                return "unable to parse far value of the view for ID = " + viewId;

            if (children[i].nodeName == "perspective") {
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle value of the view for ID = " + viewId;

                grandChildren = children[i].children;
                // Specifications for the current view.

                nodeNames = [];
                for (var j = 0; j < grandChildren.length; j++) {
                    nodeNames.push(grandChildren[j].nodeName);
                }

                // Gets indices of each element.
                var fromIndex = nodeNames.indexOf("from");
                var toIndex = nodeNames.indexOf("to");

                // Retrieves the initial position.
                var fromCoord = [];
                if (fromIndex != -1) {
                    // x
                    var x = this.reader.getFloat(grandChildren[fromIndex], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse x-coordinate of the initial position for ID = " + fromCoord;
                    else
                        fromCoord.push(x);
    
                    // y
                    var y = this.reader.getFloat(grandChildren[fromIndex], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse y-coordinate of the initial position for ID = " + fromCoord;
                    else
                        fromCoord.push(y);
    
                    // z
                    var z = this.reader.getFloat(grandChildren[fromIndex], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse z-coordinate of the initial position for ID = " + fromCoord;
                    else
                        fromCoord.push(z);
                }
                else
                    return "initial position undefined for ID = " + fromCoord;

                var toCoord = [];
                if (toIndex != -1) {
                    // x
                    var x = this.reader.getFloat(grandChildren[toIndex], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse x-coordinate of the final position for ID = " + toCoord;
                    else
                        toCoord.push(x);
    
                    // y
                    var y = this.reader.getFloat(grandChildren[toIndex], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse y-coordinate of the final position for ID = " + toCoord;
                    else
                        toCoord.push(y);
    
                    // z
                    var z = this.reader.getFloat(grandChildren[toIndex], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse z-coordinate of the final position for ID = " + toCoord;
                    else
                        toCoord.push(z);
                }
                else
                    return "final position undefined for ID = " + toCoord;

                // Store view global information.
                this.views.push([viewId, near, far, angle, fromCoord, toCoord]);

            }else{
                var left = this.reader.getFloat(children[i], 'left');
                if (!(left != null && !isNaN(left)))
                    return "unable to parse left value of the view for ID = " + viewId;

                var right = this.reader.getFloat(children[i], 'right');
                if (!(right != null && !isNaN(right)))
                    return "unable to parse right value of the view for ID = " + viewId;

                var top = this.reader.getFloat(children[i], 'top');
                if (!(top != null && !isNaN(top)))
                    return "unable to parse top value of the view for ID = " + viewId;

                var bottom = this.reader.getFloat(children[i], 'bottom');
                if (!(bottom != null && !isNaN(bottom)))
                    return "unable to parse bottom value of the view for ID = " + viewId;

                // Store view global information.
                this.views.push([viewId, near, far, left, right, top, bottom, fromCoord, toCoord]);
            }
            
            numViews++;
        }

        if (numViews == 0)
            return "at least one view must be defined";
        else if (numViews > 2)
            this.onXMLMinorError("too many views defined; you can have a maximum of 2 views (perspective and orthogonal)");

        this.log("Parsed views");

        return null;
    }


    /**
     * Parses the <ambient> block.
     * @param {illumination block element} illuminationNode
     */
    parseAmbient(ambientNode) {
        //  Parse Ambient node

        var children = ambientNode.children;

        var nodeNames = []; 

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        this.ambient = [];
        this.background = [];

        // Parse Ambient
        var indexAmbient = nodeNames.indexOf("ambient");
        if (indexAmbient == -1) {
            this.onXMLMinorError("ambient missing; assuming rgba = (0,0,0,0)");
        }
        else {
            var r = this.reader.getFloat(children[indexAmbient], 'r');
            var g = this.reader.getFloat(children[indexAmbient], 'g');
            var b = this.reader.getFloat(children[indexAmbient], 'b');
            var a = this.reader.getFloat(children[indexAmbient], 'a');

            if (r == null || g == null || b == null || a == null) {
                r = 0;
                g = 0;
                b = 0;
                a = 0;
                this.onXMLMinorError("failed to parse values of the ambient illumination; assuming zero");
            }

            this.ambient.push(r,g,b,a);
        }

        // Parse Background
        var indexBackground = nodeNames.indexOf("background");
        if (indexBackground == -1) {
            this.onXMLMinorError("background missing; assuming rgba = (0,0,0,0)");
        }
        else {
            var r = this.reader.getFloat(children[indexBackground], 'r');
            var g = this.reader.getFloat(children[indexBackground], 'g');
            var b = this.reader.getFloat(children[indexBackground], 'b');
            var a = this.reader.getFloat(children[indexBackground], 'a');

            if (r == null || g == null || b == null || a == null) {
                r = 0;
                g = 0;
                b = 0;
                a = 0;
                this.onXMLMinorError("failed to parse values of the background illumination; assuming zero");
            }
            
            this.background.push(r,g,b,a);
        }
        

        this.log("Parsed ambient");

        return null;
    }


    /**
     * Parses the <lights> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {

        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "omni" || children[i].nodeName != "spot") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');
            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";
            
            // Light enable/disable
            var enabled = true;
            var aux = this.reader.getInteger(children[i], 'enabled');
            if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
            else
                enabled = aux == 0 ? false : true;

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            if (children[i].nodeName == "spot"){
                var angle = this.reader.getFloat(children[i], 'angle');
                if (!(angle != null && !isNaN(angle)))
                    return "unable to parse angle value of the light for ID = " + lightId;
                
                var exponent = this.reader.getFloat(children[i], 'exponent');
                if (!(exponent != null && !isNaN(exponent)))
                    return "unable to parse exponent value of the light for ID = " + lightId;
            }

            // Gets indices of each element.
            var locationIndex = nodeNames.indexOf("location");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Retrieves the light location.
            var locationLight = [];
            if (locationIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[locationIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light location for ID = " + lightId;
                else
                    locationLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[locationIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light location for ID = " + lightId;
                else
                    locationLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[locationIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light location for ID = " + lightId;
                else
                    locationLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[locationIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light location for ID = " + lightId;
                else
                    locationLight.push(w);
            }
            else
                return "light location undefined for ID = " + lightId;

            // Retrieves the ambient component.
            var ambientIllumination = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient illumination for ID = " + lightId;
                else
                    ambientIllumination.push(a);
            }
            else
                return "ambient component undefined for ID = " + lightId;

            // Retrieve the diffuse component
            var diffuseIllumination = [];
            if (diffuseIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the diffuse illumination for ID = " + lightId;
                else
                    diffuseIllumination.push(a);
            }
            else
                return "diffuse component undefined for ID = " + lightId;

            // Retrieve the specular component
            var specularIllumination = [];
            if (specularIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the specular illumination for ID = " + lightId;
                else
                    specularIllumination.push(a);
            }
            else
                return "specular component undefined for ID = " + lightId;

            if (children[i].nodeName == "spot"){
                // Retrieves the light's target.
                var targetIndex = nodeNames.indexOf("target");
                var targetCoord = [];
                if (targetIndex != -1) {
                    // x
                    var x = this.reader.getFloat(grandChildren[targetIndex], 'x');
                    if (!(x != null && !isNaN(x)))
                        return "unable to parse x-coordinate of the target for ID = " + lightId;
                    else
                        targetCoord.push(x);
    
                    // y
                    var y = this.reader.getFloat(grandChildren[targetIndex], 'y');
                    if (!(y != null && !isNaN(y)))
                        return "unable to parse y-coordinate of the target for ID = " + lightId;
                    else
                        targetCoord.push(y);
    
                    // z
                    var z = this.reader.getFloat(grandChildren[targetIndex], 'z');
                    if (!(z != null && !isNaN(z)))
                        return "unable to parse z-coordinate of the target for ID = " + lightId;
                    else
                        targetCoord.push(z);
                }
                else
                    return "target coordinates undefined for ID = " + lightId;
            }

            // Store Light global information.
            if (children[i].nodeName == "omni")
                this.lights.push([lightId, enabled, locationLight, ambientIllumination, diffuseIllumination, specularIllumination]);
            else
                this.lights.push([lightId, enabled, angle, exponent, locationLight, targetCoord, ambientIllumination, diffuseIllumination, specularIllumination]);
            
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";
        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");

        return null;
    }


    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        // Parse block
        var children = texturesNode.children;

        this.textures = [];
        var numTextures = 0;

        // Any number of textures.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current texture.
            var textureId = this.reader.getString(children[i], 'id');
            if (textureId == null)
                return "no ID defined for texture";

            // Checks for repeated IDs.
            if (this.textures[textureId] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureId + ")";

            // Specifications for the current texture.

            // Retrieves the file path.
            var path = this.reader.getString(children[i], 'path');
            if (!(path != null && path != ""))
                return "unable to parse the file path for texture ID = " + textureId;

            // Store Textures global information.
            this.textures.push([textureId, path]);
            
            numTextures++;
        }

        console.log("Parsed textures");

        return null;
    }

   
    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        // Parse block
         var children = materialsNode.children;

        this.materials = [];
        var numMaterials = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            var materialId = this.reader.getString(children[i], 'id');
            if (materialId == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialId] != null)
                return "ID must be unique for each material (conflict: ID = " + materialId + ")";

            // Shininess
            var materialShininess = this.reader.getFloat(children[i], 'shininess');
            if (!(materialShininess != null && !isNaN(materialShininess) && materialShininess >= 0 && materialShininess <= 1))
                return "unable to parse the shininess component of the Material for ID = " + materialId;

            grandChildren = children[i].children;
            // Specifications for the current material.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var emissionIndex = nodeNames.indexOf("emission");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");


            // Retrieve the emission component
            var emissionMaterial = [];
            if (emissionIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[emissionIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the emission Material for ID = " + materialId;
                else
                    emissionMaterial.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[emissionIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the emission Material for ID = " + materialId;
                else
                    emissionMaterial.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[emissionIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the emission Material for ID = " + materialId;
                else
                    emissionMaterial.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[emissionIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the diffuse Material for ID = " + materialId;
                else
                    emissionMaterial.push(a);
            }
            else
                return "emission component undefined for ID = " + materialId;

            
            // Retrieves the ambient component.
            var ambientMaterial = [];
            if (ambientIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[ambientIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the ambient Material for ID = " + materialId;
                else
                    ambientMaterial.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[ambientIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the ambient Material for ID = " + materialId;
                else
                    ambientMaterial.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[ambientIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the ambient Material for ID = " + materialId;
                else
                    ambientMaterial.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[ambientIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the ambient Material for ID = " + materialId;
                else
                    ambientMaterial.push(a);
            }
            else
                return "ambient component undefined for ID = " + materialId;


            // Retrieve the diffuse component
            var diffuseMaterial = [];
            if (diffuseIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[diffuseIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the diffuse Material for ID = " + materialId;
                else
                    diffuseMaterial.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[diffuseIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the diffuse Material for ID = " + materialId;
                else
                    diffuseMaterial.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[diffuseIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the diffuse Material for ID = " + materialId;
                else
                    diffuseMaterial.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[diffuseIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the diffuse Material for ID = " + materialId;
                else
                    diffuseMaterial.push(a);
            }
            else
                return "diffuse component undefined for ID = " + materialId;



            // Retrieve the specular component
            var specularMaterial = [];
            if (specularIndex != -1) {
                // R
                var r = this.reader.getFloat(grandChildren[specularIndex], 'r');
                if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
                    return "unable to parse R component of the specular Material for ID = " + materialId;
                else
                    specularMaterial.push(r);

                // G
                var g = this.reader.getFloat(grandChildren[specularIndex], 'g');
                if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
                    return "unable to parse G component of the specular Material for ID = " + materialId;
                else
                    specularMaterial.push(g);

                // B
                var b = this.reader.getFloat(grandChildren[specularIndex], 'b');
                if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
                    return "unable to parse B component of the specular Material for ID = " + materialId;
                else
                    specularMaterial.push(b);

                // A
                var a = this.reader.getFloat(grandChildren[specularIndex], 'a');
                if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
                    return "unable to parse A component of the specular Material for ID = " + materialId;
                else
                    specularMaterial.push(a);
            }
            else
                return "specular component undefined for ID = " + materialId;


            // Store Materials global information.
            this.materials.push([materialId, materialShininess, emissionMaterial, ambientMaterial, diffuseMaterial, specularMaterial]);
            
            numMaterials++;
        }

         if (numMaterials == 0)
            return "at least one material must be defined";

        this.log("Parsed materials");
        return null;

    }
    


    /**
     * Parses the <transformations> block.
     */
    parseTransformations(transformationsNode) {

        var children = transformationsNode.children;

        this.transformations = [];
        this.transformations = mat4.create();
        mat4.identity(this.transformations);
        var numTransformations = 0;

        var grandChildren = [];

        // Checks if at least one transformation is defined.
        if (initialsNode.getElementsByTagName('transformation').length < 1)
            return "at least one transformation must be defined";

        // Any number of transformation blocks.
        for (var i = 0; i < children.length; i++) {

            // Get id of the current transformation.
            var transformationId = this.reader.getString(children[i], 'id');
            if (transformationId == null)
                return "no ID defined for transformation";

            // Checks for repeated IDs.
            if (this.transformations[transformationId] != null)
                return "ID must be unique for each transformation (conflict: ID = " + transformationId + ")";

            grandChildren = children[i].children;

            // Each transformation block.
            for (var j = 0; j < grandChildren.length; j++) {

                var translations = [];
                var rotations = [];
                var scalings = [];

                if (grandChildren[j].nodeName != "translate" || grandChildren[j].nodeName != "rotate" || grandChildren[j].nodeName != "scale") {
                    this.onXMLMinorError("unknown tag <" + grandChildren[j].nodeName + ">");
                    continue;
                }
                
                // Translation
                if(grandChildren[j].nodeName=="translate"){
                    var tx = this.reader.getFloat(grandChildren[j], 'x');
                    var ty = this.reader.getFloat(grandChildren[j], 'y');
                    var tz = this.reader.getFloat(grandChildren[j], 'z');

                    if (tx == null || ty == null || tz == null) {
                        tx = 0;
                        ty = 0;
                        tz = 0;
                        this.onXMLMinorError("failed to parse coordinates of the translation; assuming zero");
                    }

                    // Save translation data
                    translations.push(tx,ty,tz);

                } // Rotation
                else if(grandChildren[j].nodeName=="rotate"){
                    var raxis = this.reader.getString(grandChildren[j], 'axis');
                    var rangle = this.reader.getFloat(grandChildren[j], 'angle');

                    if (raxis == null || rangle == null) {
                        raxis = "x";
                        rangle = 0;
                        this.onXMLMinorError("failed to parse coordinates of the rotation; assuming zero degrees around x");
                    }

                    // Save rotation data
                    rotations.push(raxis,rangle);

                } // Scaling
                else{
                    var sx = this.reader.getFloat(grandChildren[j], 'sx');
                    var sy = this.reader.getFloat(grandChildren[j], 'sy');
                    var sz = this.reader.getFloat(grandChildren[j], 'sz');

                    if (sx == null || sy == null || sz == null) {
                        sx = 1;
                        sy = 1;
                        sz = 1;
                        this.onXMLMinorError("failed to parse values of the scaling; assuming one");
                    }

                    // Save scaling data
                    scalings.push(sx,sy,sz);
                }

                // Save Transformations global information.
                this.transformations.push([transformationId, translations, rotations, scalings]);

                numTransformations++;
            }

        if (numTransformations == 0)
            return "at least one transformation must be defined inside the block";   
                     
        }

        this.log("Parsed transformations");

        return null;
    }






parsePrimitives(primitivesNode){

        var children = primitivesNode.children;

        var nodeNames = [];
        var grandChildren = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);


        for(var i = 0; i < children.length; i++){
            var indexPrimitives = nodeNames.indexOf("primitive");
            if (children[i].nodeName != "primitives") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
            else {
                var nodeNames = [];
                grandChildren = children[i].children;
                for (var j = 0; j < grandChildren.length; j++) {
                    nodeNames.push(grandChildren[j].nodeName);
                }
                // Get id of the current primitive.
                 var primitiveId = this.reader.getString(children[i], 'id');
                 if (primitiveId == null)
                         return "no ID defined for primitive";

                this.primitive = [];

                this.primitive.push[primitiveId];

                for (var k = 0; k < nodeNames.length; k++) {

                    if (nodeNames[0] == "rectangle"){
                      
                    // x1
                    var x1 = this.reader.getFloat(grandChildren[k], 'x1');
                    if (!(x1 != null && !isNaN(x1) && x1 >= 0 && x1 <= 1))
                        return "unable to parse rectangle's X1 for ID= " + primitiveId;
                    else
                        rectanglePrimitive.push(x1);

                    // y1
                    var y1 = this.reader.getFloat(grandChildren[k], 'y1');
                    if (!(y1 != null && !isNaN(y1) && y1 >= 0 && y1 <= 1))
                        return "unable to parse rectangle's Y1 for ID = " + primitiveId;
                    else
                        rectanglePrimitive.push(y1);

                    // x2
                    var x2 = this.reader.getFloat(grandChildren[k], 'x2');
                    if (!(x2 != null && !isNaN(x2) && x2 >= 0 && x2 <= 1))
                        return "unable to parse rectangle's X1 for ID = " + primitiveId;
                    else
                        rectanglePrimitive.push(x2);

                    // y2
                    var y2 = this.reader.getFloat(grandChildren[k], 'y2');
                    if (!(y2 != null && !isNaN(y2) && y2 >= 0 && y2 <= 2))
                        return "unable to parse rectangle's Y2 for ID = " + primitiveId;
                    else
                        rectanglePrimitive.push(y2);
                    this.primitive.push("rectangle");
                    this.primitive.push(this.rectanglePrimitive);
                  
             }
                    

                    else if(nodeNames[0] == "triangle"){
                                    // x1
                            var x1 = this.reader.getFloat(grandChildren[emissionIndex], 'x1');
                            if (!(x1 != null && !isNaN(x1) && x1 >= 0 && x1 <= 1))
                                return "unable to parse triangle's X1 for ID= " + primitiveId;
                            else
                                trianglePrimitive.push(x1);

                            // y1
                            var y1 = this.reader.getFloat(grandChildren[emissionIndex], 'y1');
                            if (!(y1 != null && !isNaN(y1) && y1 >= 0 && y1 <= 1))
                                return "unable to parse triangle's Y1 for ID = " + primitiveId;
                            else
                                trianglePrimitive.push(y1);

                            // x2
                            var x2 = this.reader.getFloat(grandChildren[emissionIndex], 'x2');
                            if (!(x2 != null && !isNaN(x2) && x2 >= 0 && x2 <= 1))
                                return "unable to parse triangle's X1 for ID = " + primitiveId;
                            else
                                trianglePrimitive.push(x2);

                            // y2
                            var y2 = this.reader.getFloat(grandChildren[emissionIndex], 'y2');
                            if (!(y2 != null && !isNaN(y2) && y2 >= 0 && y2 <= 2))
                                return "unable to parse triangle's Y2 for ID = " + primitiveId;
                            else
                                trianglePrimitive.push(y2);

                               // x3
                            var x3 = this.reader.getFloat(grandChildren[emissionIndex], 'x3');
                            if (!(x3 != null && !isNaN(x3) && x3 >= 0 && x3 <= 1))
                                return "unable to parse triangle's X1 for ID = " + primitiveId;
                            else
                                trianglePrimitive.push(x3);

                            // y3
                            var y3 = this.reader.getFloat(grandChildren[emissionIndex], 'y3');
                            if (!(y3 != null && !isNaN(y3) && y3 >= 0 && y3 <= 2))
                                return "unable to parse triangle's y3 for ID = " + primitiveId;
                            else
                                trianglePrimitive.push(y3);
                             
                            this.primitive.push("triangle");
                             this.primitive.push(this.triangle);
                    }

                    else if(nodeNames[0] == "cylinder"){
                                    // base
                            var base = this.reader.getFloat(grandChildren[emissionIndex], 'base');
                            if (!(base != null && !isNaN(base) && base >= 0 && base <= 1))
                                return "unable to parse cylinder's base for ID= " + primitiveId;
                            else
                                cylinderPrimitive.push(base);

                            // top
                            var top = this.reader.getFloat(grandChildren[emissionIndex], 'top');
                            if (!(top != null && !isNaN(top) && top >= 0 && top <= 1))
                                return "unable to parse cylinder's top for ID = " + primitiveId;
                            else
                                cylinderPrimitive.push(y1);

                            // height
                            var height = this.reader.getFloat(grandChildren[emissionIndex], 'height');
                            if (!(height != null && !isNaN(height) && height >= 0 && height <= 1))
                                return "unable to parse cylinder's height for ID = " + primitiveId;
                            else
                                cylinderPrimitive.push(height);

                            // slices
                            var slices = this.reader.getFloat(grandChildren[emissionIndex], 'slices');
                            if (!(slices != null && !isNaN(slices) && slices >= 0 && slices <= 2))
                                return "unable to parse cylinder's slices for ID = " + primitiveId;
                            else
                                cylinderPrimitive.push(slices);

                         // stacks
                            var stacks = this.reader.getFloat(grandChildren[emissionIndex], 'stacks');
                            if (!(stacks != null && !isNaN(stacks) && stacks >= 0 && stacks <= 2))
                                return "unable to parse cylinder's stacks for ID = " + primitiveId;
                            else
                                cylinderPrimitive.push(stacks);

                          this.primitive.push("cylinder");        
                        this.primitive.push(this.cylinder);
                    }

                    else if(nodeNames[0] == "sphere"){
                                     // radius
                            var radius = this.reader.getFloat(grandChildren[sphereIndex], 'radius');
                            if (!(radius != null && !isNaN(radius) && radius >= 0 && radius <= 1))
                                return "unable to parse sphere's radius for ID= " + primitiveId;
                            else
                                spherePrimitive.push(radius);

                            // slices
                            var slices = this.reader.getFloat(grandChildren[sphereIndex], 'slices');
                            if (!(slices != null && !isNaN(slices) && slices >= 0 && slices <= 1))
                                return "unable to parse sphere's slices for ID = " + primitiveId;
                            else
                                spherePrimitive.push(slices);

                            // stacks
                            var stacks = this.reader.getFloat(grandChildren[sphereIndex], 'stacks');
                            if (!(stacks != null && !isNaN(stacks) && stacks >= 0 && stacks <= 1))
                                return "unable to parse sphere's X1 for ID = " + primitiveId;
                            else
                                spherePrimitive.push(stacks);
                                                        
                        this.primitive.push("sphere");
                        this.primitive.push(this.sphere);
                    }

                    else if(nodeNames[0] == "torus"){
                                  // inner
                        var inner = this.reader.getFloat(grandChildren[torusIndex], 'inner');
                        if (!(inner != null && !isNaN(inner) && inner >= 0 && inner <= 1))
                            return "unable to parse torus's inner for ID= " + primitiveId;
                        else
                            torusPrimitive.push(inner);

                        // outer
                        var outer = this.reader.getFloat(grandChildren[torusIndex], 'outer');
                        if (!(outer != null && !isNaN(outer) && outer >= 0 && outer <= 1))
                            return "unable to parse torus's X1 for ID = " + primitiveId;
                        else
                            torusPrimitive.push(outer);
                    }
                        // slices
                        var slices = this.reader.getFloat(grandChildren[torusIndex], 'slices');
                        if (!(slices != null && !isNaN(slices) && slices >= 0 && slices <= 1))
                            return "unable to parse torus's slices for ID = " + primitiveId;
                        else
                            torusPrimitive.push(slices);

                       // loops
                        var loops = this.reader.getFloat(grandChildren[torusIndex], 'loops');
                        if (!(loops != null && !isNaN(loops) && loops >= 0 && loops <= 1))
                            return "unable to parse torus's loops for ID = " + primitiveId;
                        else
                            torusPrimitive.push(loops);

                         this.primitive.push("torus");
                        this.primitive.push(this.torus);
                    }
                }
                this.primitivesData.push(this.primitive);
            }
        
        console.log("Primitives Parsed Correctly!");
        console.log(this.primitivesData);
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }


    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        // entry point for graph rendering
        //TODO: Render loop starting at root of graph
    }
}