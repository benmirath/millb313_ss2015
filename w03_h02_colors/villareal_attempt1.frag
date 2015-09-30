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


vec3 color_background = vec3 (0.75, 0.75, 1.0);
vec3 color_Blue = vec3 (0.0, 0.0, 1.0);
vec3 color_Red = vec3 (1.0, 0.0, 0.0);

void main() {
	vec2 st = gl_FragCoord.xy/u_resolution.xy;	
	vec3 color = color_background;

	//draw blue block
	vec3 pct = DrawSquare_Smooth (st, vec2 (0.05, 0.05), vec2 (0.05, 0.05), 0.075);
	color = mix (color, color_Blue, pct);

	//draw bg highlight
	pct = DrawSquare_Smooth (st, vec2 (0.025, 0.7), vec2 (0.025, 0.2), 0.15, 0.075);
	color = mix (color, color_background, pct);

	//draw subgtle lower differential
	pct = DrawSquare_Smooth (st, vec2 (0.025, 0.2), vec2 (0.025, 0.65), 0.15, 0.1);
	color = mix (color, color_Blue + 0.35, pct);


    gl_FragColor = vec4(color,1.0);

}