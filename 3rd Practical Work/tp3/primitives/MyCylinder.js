function MyCylinder(scene, base, top, height, slices, stacks) {
    CGFobject.call(this, scene);

    this.slices = parseInt(slices);
    this.stacks = parseInt(stacks);
    this.base = parseFloat(base);
    this.top = parseFloat(top);
    this.height = parseFloat(height);

    this.deltaHeight = this.height / this.stacks;
    this.delta = (this.top - this.base) / this.stacks;

    this.initBuffers();
};

MyCylinder.prototype = Object.create(CGFobject.prototype);
MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {
    var stacks = this.stacks;

    var n = -2 * Math.PI / this.slices;

    this.vertices = [];
    this.normals = [];
    this.indices = [];
    this.texCoords = [];


    var lengthX = 1 / this.slices;
    var lengthY = 1 / this.stacks;
    var xCoord = 0;
    var yCoord = 0;

    for (var q = 0; q < this.stacks+1 ; q++)
     {
        var z = (q * this.deltaHeight / this.stacks);
        var inc = (q * this.delta) + this.base;

        for (var i = 0; i <= this.slices; i++)
         {
            this.vertices.push(inc * Math.cos(i * n), inc * Math.sin(i * n), q * this.deltaHeight);
            this.normals.push(Math.cos(i * n), Math.sin(i * n), 0);

            this.texCoords.push(xCoord, yCoord);

            xCoord += lengthX;
        }

        xCoord = 0;
        yCoord += lengthY;

    }

	var sides = this.slices +1;

    for (var q = 0; q < this.stacks; q++) {
        for (var i = 0; i < this.slices; i++) {

			this.indices.push(sides*q+i, sides*(q+1)+i, sides*q+i+1);
			this.indices.push(sides*q+i+1, sides*(q+1)+i, sides*(q+1)+i+1);

			this.indices.push(sides*q+i, sides*q+i+1, sides*(q+1)+i);
			this.indices.push(sides*q+i+1, sides*(q+1)+i+1, sides*(q+1)+i);

        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
};