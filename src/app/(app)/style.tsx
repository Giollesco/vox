/* eslint-disable react/react-in-jsx-scope */

import { FocusAwareStatusBar, View } from '@/ui';
import {
  Canvas,
  Group,
  Paint,
  Paragraph,
  Rect,
  RuntimeShader,
  Skia,
  TextAlign,
  useClock,
  vec,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export default function Style() {
  // Hooks
  const { width, height } = useWindowDimensions();

  // Variables
  const F = 0.01;
  const SPEED = 1 * F;
  const isActive = useSharedValue(0);
  const progress = useSharedValue(0);
  const clock = useClock();

  // Gestures
  const gesture = useMemo(() => {
    return Gesture.Tap()
      .maxDuration(2650)
      .onBegin(() => {
        isActive.value = 1;
      })
      .onFinalize(() => {
        if (progress.value >= 1.5) {
          progress.value = 0;
        } else {
          progress.value = withTiming(0, { duration: 450 });
        }
        isActive.value = 0;
      });
  }, []);

  useFrameCallback(() => {
    if (isActive.value === 1) {
      progress.value += SPEED;
    }
  }, true);

  const uniforms = useDerivedValue(
    () => ({
      resolution: vec(width, height),
      iTime: clock.value * 0.001,
      iProgress: progress.value,
    }),
    [clock]
  );

  const source = Skia.RuntimeEffect.Make(`
      uniform vec2 resolution;
      uniform float iTime;
      uniform float iProgress;
      uniform shader image;
      vec4 texture(vec2 uv) {
        return image.eval(uv * resolution.xy);
      }
      // Function to perform the shader effect
      vec4 airdrop(vec2 fragCoord, vec2 resolution, float t) {
          // Flip the y-coordinate to match the screen's coordinate system
          vec2 position_yflip = vec2(fragCoord.x, fragCoord.y);
          float uv_y_dynamic_island_offset = 0.46;
      
          // Time-based variables
          float t2 = pow(t, 2.0);
          float t3 = pow(t, 3.0);
      
          // Normalized pixel coordinates (from 0 to 1)
          vec2 uv = position_yflip / resolution;
          vec2 uv_stretch = vec2(
              uv.x + ((uv.x - 0.5) * pow(uv.y, 6.0) * t3 * 0.1), 
              uv.y * (uv.y * pow((1.0 - (t2 * 0.01)), 8.0)) + (1.0 - uv.y) * uv.y
          );
          uv_stretch = mix(uv, uv_stretch, smoothstep(1.1, 1.0, t));
          vec4 color = texture(uv_stretch);
      
          // Variables for the "bang" effect
          vec2 bang_offset = vec2(0.0);
          float bang_d = 0.0;
          
          if (t >= 1.0) {
              float aT = t - 1.0;
              vec2 uv2 = uv;
              uv2 -= 0.5;
              uv2.x *= resolution.x / resolution.y;
              uv2.x -= 0.1;
      
              vec2 uv_bang = vec2(uv2.x, uv2.y);
              vec2 uv_bang_origin = vec2(uv_bang.x, uv_bang.y - uv_y_dynamic_island_offset);
              bang_d = (aT * 0.16) / length(uv_bang_origin);
              bang_d = smoothstep(0.09, 0.05, bang_d) * smoothstep(0.04, 0.07, bang_d) * (uv.y + 0.05);
              bang_offset = vec2(-8.0 * bang_d * uv2.x, -4.0 * bang_d * (uv2.y - 0.4)) * 0.1;
      
              float bang_d2 = ((aT - 0.085) * 0.14) / length(uv_bang_origin);
              bang_d2 = smoothstep(0.09, 0.05, bang_d2) * smoothstep(0.04, 0.07, bang_d2) * (uv.y + 0.05);
              bang_offset += vec2(-8.0 * bang_d2 * uv2.x, -4.0 * bang_d2 * (uv2.y - 0.4)) * -0.02;
          }
      
          // Apply the bang offset to the uv coordinates
          vec2 uv_stretch_bang = uv_stretch + bang_offset;
          color = texture(uv_stretch_bang);
          color += bang_d * 500.0 * smoothstep(1.05, 1.1, t);
      
          // Parameters for the blur effect
          const float Pi = 6.28318530718 * 2.0;
          const float Directions = 60.0;
          const float Quality = 10.0;
          float Radius = t2 * 0.1 * pow(uv.y, 6.0) * 0.5;
          Radius *= smoothstep(1.3, 0.9, t);
          Radius += bang_d * 0.05;
      
          // Blur calculations
          for(float d = 0.0; d < Pi; d += Pi / Directions) {
              for(float i = 1.0 / Quality; i <= 1.0; i += 1.0 / Quality) {
                  vec2 blurPos = (uv_stretch_bang + vec2(cos(d), sin(d)) * Radius * i);
                  color += texture(blurPos);
              }
          }
          color /= Quality * Directions;
      
          // Centering the uv coordinates
          uv -= 0.5;
          uv.x *= resolution.x / resolution.y;
          uv.x -= 0.1;
      
          // Adding the yellow blob effect
          vec2 lighten_uv = vec2(uv.x * 0.65, uv.y - t + 0.5);
          float d = smoothstep(0.0, 0.6, 0.1 / length(lighten_uv) - uv_y_dynamic_island_offset) * 0.25;
          float t_smooth = smoothstep(0.0, 0.3, t);
          d *= t_smooth;
          color = color + vec4(color.r * d, color.g * d, 0.0, 1.0);
      
          // Adding the white blob effect
          vec2 lighten2_uv = vec2(uv.x * 0.4, uv.y - uv_y_dynamic_island_offset);
          float d2 = smoothstep(0.0, 0.5, pow(1.0 - length(lighten2_uv), 28.0)) * 0.5;
          float t2_smooth = smoothstep(0.0, 1.0, t2) * 1.0;
          d2 *= t2_smooth;
          d2 *= smoothstep(1.13, 1.0, t);
          color = vec4(color.rgb * (1.0 - d2), 1.0) + vec4(vec3(d2), 1.0);
      
          return color;
      }
      
      // Main function
      half4 main(vec2 fragCoord) {
          // Get the resolution of the image
          vec2 resolution = resolution.xy;
      
          // Calculate the time-based parameter
          float t = iProgress;
      
          // Call the airdrop function to get the fragment color
          return airdrop(vec2(fragCoord.x, fragCoord.y), resolution, t);
      }
      
  `);

  const paragraph = useMemo(() => {
    const paragraphStyle = {
      textAlign: TextAlign.Center,
    };
    const textStyle = {
      color: Skia.Color('black'),
      fontFamilies: ['Roboto'],
      fontSize: 64,
    };
    return Skia.ParagraphBuilder.Make(paragraphStyle)
      .pushStyle(textStyle)
      .addText('Naučite nešto novo uz vox')
      .pop()
      .build();
  }, []);

  if (!source) {
    throw new Error("Couldn't compile the shader");
  }

  return (
    <>
      <FocusAwareStatusBar />

      <View style={{ flex: 1 }}>
        <GestureDetector gesture={gesture}>
          <Canvas style={{ flex: 1 }}>
            <Group
              layer={
                <Paint>
                  <RuntimeShader source={source} uniforms={uniforms} />
                </Paint>
              }
            >
              <Rect x={0} y={0} width={width} height={400} color="white" />
              <Paragraph paragraph={paragraph} x={0} y={100} width={width} />
            </Group>
          </Canvas>
        </GestureDetector>
      </View>
    </>
  );
}
