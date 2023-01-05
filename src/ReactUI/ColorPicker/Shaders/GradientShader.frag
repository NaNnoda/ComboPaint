precision mediump float;

uniform sampler2D textureSampler;
uniform vec2 resolution;


out outColor;

export void main() {
    // Look up a color from the texture.
    //    outColor = texture2D(textureSampler, resolution);
    outColor = vec4(1, 0, 0.5, 1);
}
