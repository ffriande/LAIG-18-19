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
        this.root = this.reader.getFloat(sceneNode, 'root');
        this.axis_length = this.reader.getFloat(sceneNode, 'axis_length');

        if (!(this.root != null)) {
                this.root = "";
                this.onXMLMinorError("unable to parse value for root; assuming 'root = '''");
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
            var far = this.reader.getFloat(children[i], 'far');

            if (children[i].nodeName == "perspective") {
                var angle = this.reader.getFloat(children[i], 'angle');
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
                var right = this.reader.getFloat(children[i], 'right');
                var top = this.reader.getFloat(children[i], 'top');
                var bottom = this.reader.getFloat(children[i], 'bottom');

                // Store view global information.
                this.views.push([viewId, near, far, left, right, top, bottom, fromCoord, toCoord]);
            }
            
            numViews++;
        }

        if (numViews == 0)
            return "at least one view must be defined";
        else if (numViews > 2)
            this.onXMLMinorError("too many views defined; WebGL imposes a limit of 2 views");

        this.log("Parsed views");

        return null;
    }

    /**
     * Parses the <transformations> block.
     */
    parseTransformations(transformationsNode) {

        var children = initialsNode.children;

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        // Frustum planes
        // (default values)
        this.near = 0.1;
        this.far = 500;
        var indexFrustum = nodeNames.indexOf("frustum");
        if (indexFrustum == -1) {
            this.onXMLMinorError("frustum planes missing; assuming 'near = 0.1' and 'far = 500'");
        }
        else {
            this.near = this.reader.getFloat(children[indexFrustum], 'near');
            this.far = this.reader.getFloat(children[indexFrustum], 'far');

            if (!(this.near != null && !isNaN(this.near))) {
                this.near = 0.1;
                this.onXMLMinorError("unable to parse value for near plane; assuming 'near = 0.1'");
            }
            else if (!(this.far != null && !isNaN(this.far))) {
                this.far = 500;
                this.onXMLMinorError("unable to parse value for far plane; assuming 'far = 500'");
            }

            if (this.near >= this.far)
                return "'near' must be smaller than 'far'";
        }

        // Checks if at most one translation, three rotations, and one scaling are defined.
        if (initialsNode.getElementsByTagName('translation').length > 1)
            return "no more than one initial translation may be defined";

        if (initialsNode.getElementsByTagName('rotation').length > 3)
            return "no more than three initial rotations may be defined";

        if (initialsNode.getElementsByTagName('scale').length > 1)
            return "no more than one scaling may be defined";

        // Initial transforms.
        this.initialTranslate = [];
        this.initialScaling = [];
        this.initialRotations = [];

        // Gets indices of each element.
        var translationIndex = nodeNames.indexOf("translation");
        var thirdRotationIndex = nodeNames.indexOf("rotation");
        var secondRotationIndex = nodeNames.indexOf("rotation", thirdRotationIndex + 1);
        var firstRotationIndex = nodeNames.lastIndexOf("rotation");
        var scalingIndex = nodeNames.indexOf("scale");

        // Checks if the indices are valid and in the expected order.
        // Translation.
        this.initialTransforms = mat4.create();
        mat4.identity(this.initialTransforms);

        if (translationIndex == -1)
            this.onXMLMinorError("initial translation undefined; assuming T = (0, 0, 0)");
        else {
            var tx = this.reader.getFloat(children[translationIndex], 'x');
            var ty = this.reader.getFloat(children[translationIndex], 'y');
            var tz = this.reader.getFloat(children[translationIndex], 'z');

            if (tx == null || ty == null || tz == null) {
                tx = 0;
                ty = 0;
                tz = 0;
                this.onXMLMinorError("failed to parse coordinates of initial translation; assuming zero");
            }

            // Save translation data
            this.initialTranslate.push(tx,ty,tz);

        }

        // Parse Third Rotation
        if (thirdRotationIndex == -1)
            this.onXMLMinorError("initial rotation undefined; assuming R = (0, 1, 0, 0)");
        else {
            var raxis = this.reader.getString(children[thirdRotationIndex], 'axis');
            var rangle = this.reader.getFloat(children[thirdRotationIndex], 'angle');

            if (raxis == null || rangle == null) {
                raxis = "x";
                rangle = 0;
                this.onXMLMinorError("failed to parse coordinates of initial rotation; assuming zero");
            }

            // Save rotation data
            this.initialRotations.push(raxis,rangle);

        }

        // Parse Second Rotation
        if (secondRotationIndex == -1)
            this.onXMLMinorError("initial rotation undefined; assuming R = (0, 0, 1, 0)");
        else {
            var raxis = this.reader.getString(children[secondRotationIndex], 'axis');
            var rangle = this.reader.getFloat(children[secondRotationIndex], 'angle');

            if (raxis == null || rangle == null) {
                raxis = "y";
                rangle = 0;
                this.onXMLMinorError("failed to parse coordinates of initial rotation; assuming zero");
            }

            // Save rotation data
            this.initialRotations.push(raxis,rangle);

        }

        // Parse First Rotation
        if (firstRotationIndex == -1)
            this.onXMLMinorError("initial rotation undefined; assuming R = (0, 0, 0, 1)");
        else {
            var raxis = this.reader.getString(children[firstRotationIndex], 'axis');
            var rangle = this.reader.getFloat(children[firstRotationIndex], 'angle');

            if (raxis == null || rangle == null) {
                raxis = "z";
                rangle = 0;
                this.onXMLMinorError("failed to parse coordinates of initial rotation; assuming zero");
            }

            // Save rotation data
            this.initialRotations.push(raxis,rangle);

        }

        // Parse Scaling
        if (scalingIndex == -1)
            this.onXMLMinorError("initial translation undefined; assuming S = (1, 1, 1)");
        else {
            var sx = this.reader.getFloat(children[scalingIndex], 'sx');
            var sy = this.reader.getFloat(children[scalingIndex], 'sy');
            var sz = this.reader.getFloat(children[scalingIndex], 'sz');

            if (sx == null || sy == null || sz == null) {
                sx = 1;
                sy = 1;
                sz = 1;
                this.onXMLMinorError("failed to parse coordinates of initial scaling; assuming zero");
            }

            // Save scaling data
            this.initialScaling.push(sx,sy,sz);

        }


        // Parse Reference length
 
        var indexReference = nodeNames.indexOf("reference");
        if (indexReference == -1) {
            this.onXMLMinorError("reference length missing; assuming 'length = 1'");
        }
        else {
            this.length = this.reader.getInteger(children[indexReference], 'length');

            if (!(this.length != null && !isNaN(this.length))) {
                this.length = 1;
                this.onXMLMinorError("unable to parse value for length; assuming 'length = 1'");
            }
        }

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <ILLUMINATION> block.
     * @param {illumination block element} illuminationNode
     */
    parseIllumination(illuminationNode) {
        //  Parse Illumination node

        var children = illuminationNode.children;

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
        

        this.log("Parsed illumination");

        return null;
    }


    /**
     * Parses the <LIGHTS> node.
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

            if (children[i].nodeName != "LIGHT") {
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

            grandChildren = children[i].children;
            // Specifications for the current light.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var enableIndex = nodeNames.indexOf("enable");
            var positionIndex = nodeNames.indexOf("position");
            var ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");

            // Light enable/disable
            var enableLight = true;
            if (enableIndex == -1) {
                this.onXMLMinorError("enable value missing for ID = " + lightId + "; assuming 'value = 1'");
            }
            else {
                var aux = this.reader.getFloat(grandChildren[enableIndex], 'value');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                    this.onXMLMinorError("unable to parse value component of the 'enable light' field for ID = " + lightId + "; assuming 'value = 1'");
                else
                    enableLight = aux == 0 ? false : true;
            }

            // Retrieves the light position.
            var positionLight = [];
            if (positionIndex != -1) {
                // x
                var x = this.reader.getFloat(grandChildren[positionIndex], 'x');
                if (!(x != null && !isNaN(x)))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(x);

                // y
                var y = this.reader.getFloat(grandChildren[positionIndex], 'y');
                if (!(y != null && !isNaN(y)))
                    return "unable to parse y-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(y);

                // z
                var z = this.reader.getFloat(grandChildren[positionIndex], 'z');
                if (!(z != null && !isNaN(z)))
                    return "unable to parse z-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(z);

                // w
                var w = this.reader.getFloat(grandChildren[positionIndex], 'w');
                if (!(w != null && !isNaN(w) && w >= 0 && w <= 1))
                    return "unable to parse x-coordinate of the light position for ID = " + lightId;
                else
                    positionLight.push(w);
            }
            else
                return "light position undefined for ID = " + lightId;

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

            // Store Light global information.
            this.lights.push([enableLight, positionLight, ambientIllumination, diffuseIllumination, specularIllumination]);
            
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
     * Parses the <TEXTURES> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {
        // Parse block
        var children = texturesNode.children;

        this.textures = [];
        var numTextures = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of textures.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "TEXTURE") {
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

            grandChildren = children[i].children;
            // Specifications for the current texture.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.
            var fileIndex = nodeNames.indexOf("file");
            var amplifIndex = nodeNames.indexOf("amplif_factor");

            // Retrieves the file path.
            if (fileIndex != -1){
                var path = this.reader.getString(grandChildren[fileIndex], 'path');
                if (!(path != null && path != ""))
                    return "unable to parse the file path for texture ID = " + textureId;
            } else 
                return "file path undefined for ID = " + textureId;


            // Retrieves the amplification factor.
            var amplif_factor = [];
            if (amplifIndex != -1) {
                // S
                var s = this.reader.getFloat(grandChildren[amplifIndex], 's');
                if (!(s != null && !isNaN(s) && s >= 0))
                    return "unable to parse S component of the amplification factor for texture ID = " + textureId;
                else
                    amplif_factor.push(s);

                // T
                var t = this.reader.getFloat(grandChildren[amplifIndex], 't');
                if (!(t != null && !isNaN(t) && t >= 0))
                    return "unable to parse T component of the amplification factor for texture ID = " + textureId;
                else
                    amplif_factor.push(t);
            }
            else
                return "amplification factor undefined for ID = " + textureId;

            // Store Textures global information.
            this.textures.push([path, amplif_factor]);
            
            numTextures++;
        }

        console.log("Parsed textures");

        return null;
    }

   
    /**
     * Parses the <MATERIALS> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        // TODO: Parse block
         var children = materialsNode.children;

        this.materials = [];
        var numMaterials = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {

            if (children[i].nodeName != "MATERIAL") {
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

            grandChildren = children[i].children;
            // Specifications for the current material.

            nodeNames = [];
            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            // Gets indices of each element.  
            var shininessIndex = nodeNames.indexOf("shininess");
            var specularIndex = nodeNames.indexOf("specular");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var ambientIndex = nodeNames.indexOf("ambient");
            var emissionIndex = nodeNames.indexOf("emission");

            
          // Shininess
            var materialShininess = true;
            if (shininessIndex == -1) {
                this.onXMLMinorError("shininess value missing for ID = " + materialId + "; assuming 'value = 1'");
            }
            else {
                var aux = this.reader.getInteger(grandChildren[shininessIndex], 'value');
                if (!(aux != null && !isNaN(aux) && (aux == 0 || aux == 1)))
                    ;//this.onXMLMinorError("unable to parse value component of the 'shininess' field for ID = " + materialId + "; assuming 'value = 1'");
                else
                    materialShininess = aux == 0 ? false : true;
            }

             // TODO: Retrieve the specular component
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



                // TODO: Retrieve the diffuse component
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

            

            // TODO: Retrieve the emission component
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

            // TODO: Store Materials global information.
            this.materials.push([materialShininess, specularMaterial, diffuseMaterial, ambientMaterial, emissionMaterial]);
            
            numMaterials++;
        }

         if (numMaterials == 0)
            return "at least one material must be defined";

        this.log("Parsed materials");
        return null;

    }
    

    /**
     * Parses the <NODES> block.
     * @param {nodes block element} nodesNode
     */
    parseNodes(nodesNode) {
        // TODO: Parse block
        this.log("Parsed nodes");
        return null;
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
    onXMLMinorErro(message) {
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