uniform float half_dxy;
uniform float indir_vert_offset = 0.25;
// Note: these next two come from dynamic_lighting.part, which must always be included first
//uniform vec3 scene_llc, scene_scale; // scene bounds (world space)
uniform sampler3D smoke_and_indir_tex;
uniform vec3 const_indir_color = vec3(0.0);

in vec3 vpos, normal; // world space

vec3 indir_lookup(in vec3 pos) {
	vec3 spos = clamp((pos - scene_llc)/scene_scale, 0.0, 1.0); // should be in [0.0, 1.0] range
	return texture(smoke_and_indir_tex, spos.zxy).rgb; // add indir light color from texture
}

void add_indir_lighting(inout vec3 lit_color) {
	vec3 indir_color = const_indir_color; // add constant indir

	if (indir_lighting) {
#ifdef USE_BUMP_MAP_INDIR // USE_BUMP_MAP must also be set
		vec3 n_eye = inverse(get_tbn(1.0)) * get_bump_map_normal(); // convert tangent space to eye space
		vec3 n = normalize(inverse(fg_NormalMatrix) * n_eye); // convert eye space to world space
#else
		vec3 n = normal;
#endif
		vec3 spos = vpos + (indir_vert_offset*half_dxy)*n; // move slightly away from the vertex
		vec3 indir_light = indir_lookup(spos);
		//indir_light    = pow(indir_light, vec3(0.45)); // gamma correction
		indir_color     += indir_light; // indirect lighting
	}
	lit_color += gl_Color.rgb * indir_color;
}
