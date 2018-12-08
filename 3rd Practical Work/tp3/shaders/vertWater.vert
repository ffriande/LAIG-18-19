attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D heightmap;
uniform float heightscale;


uniform float timeFactor;

vec4 getVariation(vec2 texcoord){
    vec2 noise1 = (texcoord)+vec2(sin( texcoord.y + texcoord.x + 5.0*timeFactor) * 0.05,sin( texcoord.y + texcoord.x + 5.0*timeFactor)*0.05);
    vec2 noise2 = texcoord-vec2(cos( texcoord.y + texcoord.x + 5.0*timeFactor)* 0.05,cos( texcoord.y + texcoord.x + 5.0*timeFactor) * 0.05);
    vec2 noise3 = texcoord/vec2(1000.0/heightscale, 1000.0/heightscale)+vec2(timeFactor/100.0, timeFactor/-100.0);
    vec2 noise4 = texcoord/vec2(1000.0/heightscale, 1000.0/heightscale)-vec2(timeFactor/100.0, timeFactor/-100.0);
    vec4 variation = texture2D(heightmap, noise1)+texture2D(heightmap, noise2)+texture2D(heightmap, noise3) +texture2D(heightmap, noise4);
    return variation*0.4-1.0;
}
/*void main() {
	vec3 offset=vec3(0.0,0.0,0.0);
	vTextureCoord = aTextureCoord;
    offset = aVertexNormal*10.0*(getVariation(aTextureCoord).b/10.0);
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);
}
*/

void main() {
    //vec2 aux=SineWave(heightmap);
	vec3 offset=vec3(0.0,0.0,0.0);
    vec4 noisy=getVariation(aTextureCoord);   
    offset = aVertexNormal*10.0*((noisy.b)*heightscale/100.0);
//	offset=vec3(aVertexPosition.x,aVertexPosition.y+((texture2D(heightmap,aTextureCoord).b)*heightscale),aVertexPosition.z);
	vTextureCoord = aTextureCoord;
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+offset, 1.0);	
}
