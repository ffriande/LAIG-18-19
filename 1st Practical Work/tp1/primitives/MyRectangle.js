function MyRectangle(scene, x0, y0, x1, y1) {
	CGFobject.call(this,scene);
 	this.x0 = x0;
	this.x1 = x1;
 	this.y0 = y0;
	this.y1 = y1;
 	this.initBuffers();
};
 MyRectangle.prototype = Object.create(CGFobject.prototype);
MyRectangle.prototype.constructor=MyRectangle;
 MyRectangle.prototype.initBuffers = function () {
	this.vertices = [
		this.x0, this.y1, 0,
		this.x1, this.y1, 0,
		this.x0, this.y0, 0,
		this.x1, this.y0, 0,
	];
 	this.indices = [
		2, 1, 0,
		1, 2, 3,
	];
 	this.primitiveType=this.scene.gl.TRIANGLES;
 	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
	];
 	this.initGLBuffers();
};
 MyRectangle.prototype.setST = function (S, T) {
 	this.S = S;
	this.T = T;
 	this.texCoords = [0,0,
 					  this.S, 0,
 					  0,  this.T,
 					  this.S, this.T
					 ];
 	this.updateTexCoordsGLBuffers();
}; 