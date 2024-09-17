import type { SkRuntimeEffect, Uniforms } from '@shopify/react-native-skia';
import {
  Canvas,
  Fill,
  ImageShader,
  Shader,
  Skia,
  useClock,
  useImage,
} from '@shopify/react-native-skia';
import React, { useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {};

const Airdrop = (props: Props) => {
  // Hooks
  const { width, height } = useWindowDimensions();
  const clock = useClock();

  // Variables
  const F = 0.0025;
  const SPEED = 1 * F;
  const isActive = useSharedValue(0);
  const progress = useSharedValue(0);

  // Uniforms
  const uniforms = useDerivedValue<Uniforms>(() => {
    return {
      iResolution: [width, height],
      iTime: clock.value * 0.001,
      iProgress: progress.value,
    };
  }, []);

  // Functions
  const tap = useMemo(() => {
    return Gesture.Tap()
      .onTouchesDown(() => {
        isActive.value = 1;
      })
      .onTouchesUp(() => {
        progress.value = withTiming(0, { duration: 750 });
        isActive.value = 0;
      });
  }, []);

  useFrameCallback(() => {
    if (isActive.value === 1) {
      progress.value += SPEED;
    }
  }, true);

  const image = useImage(
    'https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/18-cute-cat-sampad-art.jpg'
  );
  if (!image) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <GestureDetector gesture={tap}>
        <Canvas
          style={{
            width,
            height,
          }}
        >
          <Fill>
            <Shader source={source} uniforms={uniforms}>
              <ImageShader
                image={image}
                fit="cover"
                rect={{ x: 0, y: 0, width, height }}
              />
            </Shader>
          </Fill>
        </Canvas>
      </GestureDetector>
    </View>
  );
};

export default Airdrop;

const source: SkRuntimeEffect | any = Skia.RuntimeEffect.Make(`
    uniform float iTime;
    uniform vec2 iResolution;
    uniform shader iImage;
    uniform float iProgress;
    const float PI = 3.14159265359;
    const int samples = 35;
    const int LOD = 2; // gaussian done on MIPmap at scale LOD
    const float sigma = float(samples) * 0.25;
    const int sLOD = int(pow(2.0, float(LOD)));
    
    float map(float value, float min1, float max1, float min2, float max2) {
      return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    
    float gaussian(vec2 i) {
        return exp(-.5 * dot(i /= sigma, i)) / (6.28 * sigma * sigma);
    }
    
    vec4 sample(vec2 uv) {
      return iImage.eval(uv * iResolution.xy);
    }
    
    vec4 blur(vec2 U, vec2 scale) {
        vec4 O = vec4(0);  
        const int s = samples / sLOD;
        const int limit = s * s;
        
        for (int i = 0; i < limit; i++) {
            int ix = i - (i / s) * s;  // Equivalent to i % s
            int iy = i / s;            // Equivalent to i / s
            vec2 d = vec2(float(ix), float(iy)) * float(sLOD) - float(samples) / 2.0;
            O += gaussian(d) * sample(U + scale * d);
        }
        
        return O / O.a;
    }
    
    // Custom ease-in function for upward direction
    float easeInCubic(float x) {
        return 1.0 - cos((x * PI) / 2.0);
    }
    
    //wave
    
    float circle(in vec2 _st, in float _radius) {
        vec2 dist = _st - vec2(0.50, 1.0);
        float c1 = smoothstep(_radius - (_radius * 0.5),
                              _radius,
                              dot(dist, dist) * 4.0);
        float c2 = 1.0 - smoothstep(_radius,
                                    _radius + (_radius * 0.5),
                                    dot(dist, dist) * 4.0);
    
        return c1 * c2;
    }
    
    vec4 main(vec2 fragCoord) {
        // Normalized pixel coordinates (from 0 to 1)
        vec2 uv = fragCoord / iResolution.xy;
        uv.y = uv.y;
        
        float range = (1.0 + sin(iTime)) * 0.5; // Normalize the time range from 0 to 1
        
        // glow
        float mrange3 = map(range, 0.0, 1.0, -0.2, 1.6);
        float pct = distance(uv, vec2(0.5, mrange3));
        pct = smoothstep(0.0, 0.25, pct);
        vec3 gcircle = mix(vec3(0.8, 0.9922, 1.0), vec3(1.0), pct);
        
        // glow2
        float mrange2 = map(range, 0.0, 1.0, -0.3, 1.5);
        float pct2 = distance(uv, vec2(0.5, mrange2));
        pct2 = smoothstep(0.0, 0.25, pct2);
        vec3 gcircle2 = mix(vec3(1.0, 0.9882, 0.8), vec3(1.0), pct2);
        
        // glow3
        float mrange = map(range, 0.0, 1.0, -0.4, 1.4);
        float pct3 = distance(uv, vec2(0.5, mrange));
        pct3 = smoothstep(0.0, 0.25, pct3);
        vec3 gcircle3 = mix(vec3(1.0, 0.8902, 0.8), vec3(1.0), pct3);
        
        // blur
        float blurpct = smoothstep(0.0, 1.0, uv.y) * range;
        vec4 blurredPixel = blur(uv, 1.0 / iResolution.xy);
        
        // stretch
        float yStretch = easeInCubic(uv.y);
        yStretch = yStretch * 0.1 * range;
        uv.y -= yStretch;
        
        // wave
        float range2 = sin(iTime) < 0.0 ? 0.0 : sin(iTime);
        vec2 st2 = uv;
        float r = 5.0 * range2;
        float wpct = 1.0 - circle(st2, r);
        vec3 cc = mix(vec3(1.069, 1.077, 1.100), vec3(1.0), wpct);
        cc = pow(cc, vec3(8.0));
        float wStretch = st2.y * 0.3 * range2 * (wpct - st2.y);
        st2.y += wStretch;
        vec4 wcolor = sample(st2);
        wcolor *= vec4(cc, 1.0);
        
        // remove the wStretch
        uv.y += wStretch;
        
        vec4 color = sample(uv);
        
        color = mix(color, wcolor, vec4(pct));
        color = mix(color, blurredPixel, vec4(blurpct));
        wcolor = mix(wcolor, color, vec4(pct));
        
        color *= vec4(gcircle, 1.0);
        color *= vec4(gcircle2, 1.0);
        color *= vec4(gcircle3, 1.0);
        color *= vec4(gcircle, 1.0);
        color *= vec4(gcircle2, 1.0);
        color *= vec4(gcircle3, 1.0);
        color *= vec4(gcircle, 1.0);
        color *= vec4(gcircle2, 1.0);
        color *= vec4(gcircle3, 1.0);
        
        return color;
    }
    

  
`);
