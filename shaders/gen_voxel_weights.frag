uniform vec3 offset, scale;
uniform float start_mag, start_freq, rx, ry, zval;

in vec3 vpos;

void main()
{
	vec3 pos   = offset + scale*vec3(vpos.x, vpos.y, zval);
	float val  = 0.0;
	float mag  = start_mag;
	float freq = start_freq;
	float crx  = rx;
	float cry  = ry;
	const float lacunarity = 1.92;
	const float gain       = 0.5;
	const int NUM_OCTAVES  = 5;

	for (int i = 0; i < NUM_OCTAVES; ++i) {
		float noise = simplex(freq*pos + vec3(crx, cry, crx-cry));
		val  += mag*noise;
		mag  *= gain;
		freq *= lacunarity;
		crx  *= 1.5;
		cry  *= 1.5;
	}
	fg_FragColor = vec4(val, 0.0, 0.0, 1.0); // only red channel is used
}


