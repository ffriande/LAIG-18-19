attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
varying vec2 heightmap;
uniform float heightscale;


uniform float timeFactor;

vec2 SineWave( vec2 p)
    {
    // convert Vertex position <-1,+1> to texture coordinate <0,1> and some shrinking so the effect dont overlap screen
    p.x=( 0.55*p.x)+0.5;
    p.y=(-0.55*p.y)+0.5;
    // wave distortion
    float x = sin( 25.0*p.y + 30.0*p.x + 6.28*timeFactor) * 0.05;
    float y = sin( 25.0*p.y + 30.0*p.x + 6.28*timeFactor) * 0.05;
    return vec2(p.x+x, p.y+y);
}

void main() {
    //vec2 aux=SineWave(heightmap);
	vec3 offset=vec3(0.0,0.0,0.0);
	offset=vec3(aVertexPosition.x,aVertexPosition.y+((texture2D(heightmap,aTextureCoord).b)*heightscale),aVertexPosition.z);
	vTextureCoord = aTextureCoord;
    gl_Position = uPMatrix * uMVMatrix * vec4(offset, 1.0);	
}
