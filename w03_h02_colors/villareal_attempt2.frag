#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

vec3 DrawSquare_Smooth (vec2 st, vec2 pos1, vec2 pos2, float smoothing) {
     vec3 color = vec3(0.0);
    
    // bottom-left
    vec2 bl = smoothstep(pos1, pos1 + smoothing,st); 
    float pct = bl.x * bl.y;

    // top-right 
    vec2 tr = smoothstep(pos2, pos2 + smoothing,1.0-st);  //distance from right and top (counter intuitive)
    pct *= tr.x * tr.y;
    
    color = vec3(pct);
    return color;
    // return vec4 (color, 1.0);
}
vec3 DrawSquare_Smooth (vec2 st, vec2 pos1, vec2 pos2, float smoothingX, float smoothingY) {
     vec3 color = vec3(0.0);
    
    // bottom-left
    vec2 bl = smoothstep(pos1, vec2 (pos1.x + smoothingX, pos1.y + smoothingY), st); 
    float pct = bl.x * bl.y;

    // top-right 
    vec2 tr = smoothstep(pos2, vec2 (pos2.x + smoothingX, pos2.y + smoothingY), 1.0 - st);  //distance from right and top (counter intuitive)
    pct *= tr.x * tr.y;
    
    color = vec3(pct);
    return color;
    // return vec4 (color, 1.0);
}


vec3 colorA = vec3(0.07,0.84,0.85);		//0.07, 0.84, 0.85
vec3 colorB = vec3(0.65,0.05,0.00);		//0.65, 0.05, 0.00


vec3 color_background = vec3 (1.0, 0.0, 0.0);
vec3 color_Pink = vec3 (1.0, 0.45, 0.85);
vec3 color_White = vec3 (1.0, 1.0, 1.0);
vec3 color_Yellow = vec3 (1.0, 0.9, 0.3);

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;	
	vec3 color = color_background;

	//draw white top highlight
	vec3 pct = DrawSquare_Smooth (st, vec2 (-0.1, 0.4), vec2 (-0.1, -0.1), 0.2, 0.2);
	color = mix (color, color_Pink, pct);

	//draw white top highlight
	pct = DrawSquare_Smooth (st, vec2 (-0.1, 0.65), vec2 (-0.1, 0.05), 0.3, 0.05);
	color = mix (color, color_White, pct);

	//draw yellow bottom highlight
	pct = DrawSquare_Smooth (st, vec2 (0.025, 0.02), vec2 (0.025, 0.75), 0.15, 0.1);
	color = mix (color, color_Yellow, pct);

	//draw subgtle lower differential
	// pct = DrawSquare_Smooth (st, vec2 (0.025, 0.2), vec2 (0.025, 0.65), 0.15, 0.1);
	// color = mix (color, color_Blue + 0.35, pct);

    gl_FragColor = vec4(color,1.0);

}