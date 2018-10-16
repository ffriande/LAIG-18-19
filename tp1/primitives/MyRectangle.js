class MyRectangle{
	constructor(scene, x0, y0, x1, y1)	
	{
		CGFobject.call(this,scene);

		this.x0 = x0;
		this.x1 = x1;
		this.y0 = y0;
		this.y1 = y1;

		this.initBuffers();
	}

	initBuffers()
	{
		this.vertices = 
			[this.x0, this.y1, 0,
			this.x1, this.y1, 0,
			this.x0, this.y0, 0,
			this.x1, this.y0, 0];

		this.indices = 
			[2, 1, 0,
			1, 2, 3];

		this.normals = 
			[0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1];

		this.primitiveType=this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}
	
	//textures
	setAmpSAmpT(ampS, ampT) {

		this.ampS = ampS;
		this.ampT = ampT;

		this.texCoords = [
			0, (this.y0 - this.y1) / this.ampT,
			(this.x1- this.x0) / this.ampS, (this.y0 - this.y1) / this.ampT,
			0, 0,
			(this.x1- this.x0) / this.ampS, 0,
		];

		this.setTex = true;

		this.updateTexCoordsGLBuffers();
	}
}
