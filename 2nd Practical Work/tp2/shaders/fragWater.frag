#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;
uniform sampler2D text;


uniform float timeFactor;

vec2 wave( vec2 p )
    {
  //  p.x=( 0.55*p.x)+0.5;
    //p.y=(-0.55*p.y)+0.5;
    // wave distortion
    float x = sin( 25.0*p.y + 30.0*p.x + 5.0*timeFactor) * 0.05;
    float y = sin( 25.0*p.y + 30.0*p.x + 5.0*timeFactor) * 0.05;
    return vec2(p.x+x, p.y+y);
    }

void main()
    {
		
	//gl_FragColor = texture2D(text, vTextureCoord);
    gl_FragColor = texture2D(text,wave(vTextureCoord));
    }