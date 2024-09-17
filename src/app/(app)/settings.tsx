/* eslint-disable react/react-in-jsx-scope */

import {
  Canvas,
  Group,
  Paint,
  Paragraph,
  Rect,
  RuntimeShader,
  Skia,
  TextAlign,
  vec,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { FocusAwareStatusBar, View } from '@/ui';

export default function Settings() {
  // Hooks
  const { width, height } = useWindowDimensions();

  // Variables
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const isGestureActive = useSharedValue(0);

  // Gestures
  const gesture = Gesture.Pan()
    .onBegin(({ x, y }) => {
      offsetX.value = x;
      offsetY.value = y;
      isGestureActive.value = withTiming(1);
    })
    .onChange(({ x, y }) => {
      offsetX.value = x;
      offsetY.value = y;
    })
    .onFinalize(({ velocityX }) => {
      isGestureActive.value = withTiming(0, { duration: 450 });
      offsetX.value = withTiming(0, { duration: 450 });
      offsetY.value = withTiming(0, { duration: 450 });
    });

  const uniforms = useDerivedValue(
    () => ({
      resolution: vec(width, height),
      fingerPosition: vec(offsetX.value, offsetY.value),
      isGestureActive: isGestureActive.value,
    }),
    []
  );

  const source = Skia.RuntimeEffect.Make(`
      uniform vec2 resolution;
      uniform vec2 fingerPosition;
      uniform float isGestureActive;
      uniform shader image;

      vec4 texture(vec2 uv) {
        return image.eval(uv * resolution.xy);
      }
      
      // Function to perform the distortion effect based on mouse position
      vec4 weightedAverageEffect(vec2 uv, vec2 v, vec4 a, vec2 mouse, vec2 resolution) {
          // Normalize the mouse position
          vec2 l = mouse / resolution;
      
          // Calculate the distortion vector based on the distance from the mouse
          vec2 m = -v * pow(clamp(1.0 - length(l - uv) / 0.5, 0.0, 1.0), 2.0) * 1.5;
      
          // Initialize color accumulator
          vec3 color = vec3(0.0);
      
          // Apply the weighted average effect
          for (float i = 0.0; i < 10.0; i++) {
              float s = 0.175 + 0.005 * i;
              color += vec3(texture(uv + s * m).r,            // Sample red channel
                            texture(uv + (s + 0.025) * m).g,  // Sample green channel
                            texture(uv + (s + 0.05) * m).b);  // Sample blue channel
          }
      
          // Average the accumulated color values
          return vec4(color / 10.0, 1.0);
      }
      
      // Main function to render the image
      half4 main(vec2 fragCoord) {
          // Get the resolution of the image
          vec2 resolution = resolution.xy;
      
          // Normalize the fragment coordinates
          vec2 uv = fragCoord / resolution.xy;
      
          // Set the distortion vector
          vec2 v = vec2(0.0, -isGestureActive / 6.);
      
          // Get the mouse position
          vec2 mouse = fingerPosition;
      
          // Call the distortion function and set the fragment color
          return weightedAverageEffect(uv, v, texture(uv), mouse, resolution);
      }
      
  `);

  const paragraph = useMemo(() => {
    const paragraphStyle = {
      textAlign: TextAlign.Center,
    };
    const textStyle = {
      color: Skia.Color('white'),
      fontFamilies: ['Roboto'],
      fontSize: 42,
    };
    return Skia.ParagraphBuilder.Make(paragraphStyle)
      .pushStyle(textStyle)
      .addText(
        'Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World! Hello World!'
      )
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
              <Rect x={0} y={0} width={width} height={400} color="black" />
              <Paragraph paragraph={paragraph} x={0} y={100} width={width} />
            </Group>
          </Canvas>
        </GestureDetector>
      </View>
    </>
  );
}
