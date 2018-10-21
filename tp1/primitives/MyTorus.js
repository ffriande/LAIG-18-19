function MyTorus(scene, inner, outer, slices, loops) {
    CGFobject.call(this, scene);

    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
}
;
MyTorus.prototype = Object.create(CGFobject.prototype);
MyTorus.prototype.constructor = MyTorus;

MyTorus.prototype.initBuffers = function() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for (var i = 0; i <= this.loops; i++) {

        var theta = i * 2 * Math.PI / this.loops;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var j = 0; j <= this.slices; j++) {

            // x(Theta, Phi) = (R + r * cos(Theta)) * cos(Phi)
            // y(Theta, Phi) = (R + r * cos(Theta)) * sin(Phi)
            // z(Theta, Phi) = r * sin(Theta)

            // r = (outer - inner) / 2
            // R = inner + r;

            var phi = j * 2 * Math.PI / this.slices;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var r = (this.outer - this.inner) / 2;
            var R = this.inner + r;

            var x = (R + r * cosTheta) * cosPhi;
            var y = (R + r * cosTheta) * sinPhi;
            var z = r * sinTheta;

            var s = 1 - (i / this.loops);
            var t = 1 - (j / this.slices);

            this.vertices.push(x, y, z);
            this.normals.push(x, y, z);
            this.texCoords.push(s, t);
        }
    }

    for (var i = 0; i < this.loops; i++) {
        for (var j = 0; j < this.slices; j++) {

            var first = (i * (this.slices + 1)) + j;
            var second = first + this.slices + 1;

            this.indices.push(first, second + 1, second);
            this.indices.push(first, first + 1, second + 1);
        }
    }
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
}
;
