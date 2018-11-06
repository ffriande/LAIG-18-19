/**
 * MyTorus
 * @constructor
 */

class MyTorus extends CGFobject{
    constructor(scene, inner_r, outer_r, slices, stacks) {
        super(scene);
        this.outer_r = outer_r;
        this.inner_r = inner_r;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();

    };

    initBuffers(){

        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        this.deltaS = 1.0 / this.slices;
        this.deltaT = 1.0 / this.stacks;
        this.s = 0;
		this.t = 0;

        for (var stack_c = 0; stack_c <= this.stacks; stack_c++)
          {
            var ang = stack_c * 2 * Math.PI / this.stacks;
            this.s = 0;
            for (var slice_c = 0; slice_c <= this.slices; slice_c++) {
                var phi = slice_c * 2 * Math.PI / this.slices;

                var x = (this.outer_r + this.inner_r * Math.cos(phi)) * Math.cos(ang);
                var y = (this.outer_r + this.inner_r * Math.cos(phi)) * Math.sin(ang);
                var z = this.inner_r * Math.sin(phi);

                this.vertices.push(x);
                this.vertices.push(y);
                this.vertices.push(z);

                this.normals.push(x);
                this.normals.push(y);
                this.normals.push(z);

                this.texCoords.push(this.t,this.s);
                if (this.s >= 1) {
          				this.s = 0;
          			} else
          				this.s += this.deltaS;

            }
            this.t += this.deltaT;
        }

        for (var stack_c = 0; stack_c < this.stacks; stack_c++) {
            for (var slice_c = 0; slice_c < this.slices; slice_c++) {
                var first = (stack_c * (this.slices + 1)) + slice_c;
                var second = first + this.slices + 1;
                this.indices.push(first, second, first + 1);
                this.indices.push(second, second + 1, first + 1);
            }
        }



        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }


    updateTexCoords(afS, afT) {

      this.updateTexCoordsGLBuffers();
    };

}