import type {
  DataSourceParam,
  SkPoint,
  SkRect,
  Uniforms,
} from '@shopify/react-native-skia';
import {
  Canvas,
  dist,
  ImageShader,
  rect,
  RoundedRect,
  rrect,
  Shader,
  Skia,
  useImage,
  vec,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';

type Value = string | number;
type Values = Value[];

export const glsl = (source: TemplateStringsArray, ...values: Values) => {
  const processed = source.flatMap((s, i) => [s, values[i]]).filter(Boolean);
  return processed.join('');
};

export const frag = (source: TemplateStringsArray, ...values: Values) => {
  const code = glsl(source, ...values);
  const rt = Skia.RuntimeEffect.Make(code);
  if (rt === null) {
    throw new Error("Couldn't Compile Shader");
  }
  return rt;
};

const ripple = frag`
  uniform shader iImage;
  uniform vec2 iResolution; 
  uniform vec2 iOrigin;
  uniform float iRadius;
  const float amplitude = 0.03;
  const float frequency = 6.0;
  const float decay = 2.0;
  vec4 main(vec2 xy) {  
    float delta = 1.0 - smoothstep(0.0, iRadius, distance(xy, iOrigin));
    float rippleAmount = amplitude * sin(frequency * delta) * exp(-decay * delta);  
    xy += rippleAmount * iResolution;
    vec3 color = iImage.eval(xy).rgb;
    color += 0.1 * (rippleAmount / amplitude);
    return vec4(color, 1.0);
  }
  `;

const SPEED = 8;

export const Ripple = ({
  source,
  imageRect,
  imageRectRadius,
}: {
  source: DataSourceParam;
  imageRect: SkRect;
  imageRectRadius: number;
}) => {
  const iOrigin = useSharedValue(vec(0));
  const image = useImage(source);
  const rippleRadius = useSharedValue(0);
  const rippleMaxRadius = useSharedValue(0);

  const getMaxRadius = (pos: SkPoint) => {
    'worklet';

    const spacing = 300;
    const c1 = dist(vec(-spacing, -spacing), pos);
    const c2 = dist(vec(imageRect.width + spacing, -spacing), pos);
    const c3 = dist(
      vec(imageRect.width + spacing, imageRect.height + spacing),
      pos
    );
    const c4 = dist(vec(-spacing, imageRect.height + spacing), pos);
    return Math.max(c1, c2, c3, c4);
  };

  const uniforms = useDerivedValue<Uniforms>(() => {
    return {
      iResolution: [imageRect.width, imageRect.height],
      iOrigin: iOrigin.value,
      iRadius: rippleRadius.value,
    };
  }, []);

  const tap = useMemo(() => {
    return Gesture.Tap().onEnd(({ x, y }) => {
      iOrigin.value = vec(x, y);
      rippleRadius.value = 0;
      rippleMaxRadius.value = getMaxRadius(iOrigin.value);
    });
  }, []);

  useFrameCallback(() => {
    if (rippleRadius.value < rippleMaxRadius.value) {
      rippleRadius.value += SPEED;
    }
  }, true);

  if (!image) {
    return null;
  }

  return (
    <GestureDetector gesture={tap}>
      <Canvas
        style={{
          width: imageRect.width,
          height: imageRect.height,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.37,
          shadowRadius: 7.49,

          elevation: 12,
        }}
      >
        <RoundedRect rect={rrect(imageRect, imageRectRadius, imageRectRadius)}>
          <Shader source={ripple} uniforms={uniforms}>
            <ImageShader image={image} rect={imageRect} fit="cover" />
          </Shader>
        </RoundedRect>
      </Canvas>
    </GestureDetector>
  );
};

const RipplePage = () => {
  const { width, height } = useWindowDimensions();
  return (
    <Ripple
      source="https://preview.redd.it/cat-astronaut-v0-wmyytashnyqb1.jpg?auto=webp&s=2150d4e135b8dbadf507125a4e3dbffc3cacd54b"
      imageRect={rect(0, 0, width, height)}
      imageRectRadius={20}
    />
  );
};

export default RipplePage;
