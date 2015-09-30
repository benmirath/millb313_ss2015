// Author @patriciogv - 2015    //modified by Ben...
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec4 DrawSquare (vec2 st, vec2 pos1, vec2 pos2) {
    vec2 bl = floor(st + 1.0 - pos1);   // bottom-left
    vec2 tr = floor(1.0 - st + pos2);   // top-right     
    vec3 color = vec3(bl.x * bl.y * tr.x * tr.y);
    return vec4(color,1.0);
}
vec4 DrawSquare (vec2 st, vec2 pos1, vec2 pos2, vec3 col) {
    vec2 bl = floor(st + 1.0 - pos1);   // bottom-left
    vec2 tr = floor(1.0 - st + pos2);   // top-right     
    vec3 color = vec3(bl.x * bl.y * tr.x * tr.y * col);
    return vec4(color,1.0);
}
vec4 DrawSquare_Smooth (vec2 st, vec2 pos1, vec2 pos2, float smoothing) {
     vec3 color = vec3(0.0);
    
    // bottom-left
    vec2 bl = smoothstep(pos1, pos1 + smoothing,st); 
    float pct = bl.x * bl.y;

    // top-right 
    vec2 tr = smoothstep(pos2, pos2 + smoothing,1.0-st);  //distance from right and top (counter intuitive)
    pct *= tr.x * tr.y;
    
    color = vec3(pct);
    return vec4 (color, 1.0);
}
vec4 DrawSquare_Outline (vec2 st, vec2 pos1, vec2 pos2) {
    vec2 bl = floor(st + 1.0 - pos1);   // bottom-left
    vec2 tr = floor(1.0 - st + pos2);   // top-right  

    vec3 color = vec3 (0.0);
    if (distance(st.x, pos1.x) < 0.01 
        || distance(st.y, pos1.y) < 0.01 
        || distance (st.x, pos2.x) < 0.01
        || distance (st.y, pos2.y) < 0.01) {
        color = vec3(bl.x * bl.y * tr.x * tr.y);    
    }
    // vec3 color = vec3(bl.x * bl.y * tr.x * tr.y) * (vec3(1.0) - vec3(bl.x * bl.y * tr.x * tr.y));
    return vec4(color,1.0);
}

float plot (vec2 st, float pct){
  return  smoothstep( pct-0.01, pct, st.y) - 
          smoothstep( pct, pct+0.01, st.y);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    // gl_FragColor = DrawSquare (st, vec2 (0.2,0.5), vec2 (0.69,0.9));

    // gl_FragColor = DrawSquare_Outline (st, vec2 (0.3,0.2), vec2 (0.9,0.9));

    gl_FragColor = DrawSquare_Smooth (st, vec2 (0.1,0.1), vec2 (0.1,0.1), 0.0);

    // gl_FragColor = DrawSquare (st, vec2 (0.7,0.5), vec2 (0.9,0.9));
    // gl_FragColor += DrawSquare (st, vec2 (0.2,0.5), vec2 (0.69,0.9), vec3 (1.0,0.0,0.0));
    // gl_FragColor += DrawSquare (st, vec2 (0.4,0.25), vec2 (0.6,0.4), vec3 (0.5,0.0,1.0));
    
}