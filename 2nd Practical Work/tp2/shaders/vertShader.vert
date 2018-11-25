attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D height;
uniform float heightscale;

void main() {
	vec3 offset=vec3(0.0,0.0,0.0);
	offset=vec3(aVertexPosition.x,aVertexPosition.y+((texture2D(height,aTextureCoord).b)*heightscale),aVertexPosition.z);
	vTextureCoord = aTextureCoord;
    gl_Position = uPMatrix * uMVMatrix * vec4(offset, 1.0);	
}