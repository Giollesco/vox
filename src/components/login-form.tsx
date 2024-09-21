import { zodResolver } from '@hookform/resolvers/zod';
import { useAssets } from 'expo-asset';
import { Link } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as z from 'zod';

import { Button, colors, ControlledInput, Image, Text, View } from '@/ui';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email adresa je obavezna',
    })
    .email('Unesite ispravnu email adresu'),
  password: z
    .string({
      required_error: 'Lozinka je obavezna',
    })
    .min(6, 'Lozinka mora imati najmanje 6 slova'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  loading?: boolean;
};

export const LoginForm = ({ onSubmit = () => {}, loading }: LoginFormProps) => {
  // Hooks

  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const { width, height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const [assets] = useAssets([require('assets/icons/language-sign-black.png')]);

  return (
    <View className="flex h-full w-full items-end justify-end">
      <View
        style={{
          paddingHorizontal: 10,
          marginBottom: Math.max(bottom, 32) + 40,
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          width: width,
        }}
      >
        <MotiView
          from={{ opacity: 0, bottom: -8 }}
          animate={{ opacity: 1, bottom: 0 }}
          delay={0}
        >
          <Text className="text-center text-5xl" weight="medium">
            Prijavite se
          </Text>
        </MotiView>

        <View className="w-full" style={{ gap: 3 }}>
          <MotiView
            from={{ opacity: 0, bottom: -8 }}
            animate={{ opacity: 1, bottom: 0 }}
            delay={150}
          >
            <ControlledInput
              testID="email-input"
              control={control}
              name="email"
              className="w-min rounded-4xl px-4 text-black"
              style={{ height: 64, backgroundColor: '#b8b8b8' }}
              placeholder="Unesite email adresu"
              placeholderTextColor={colors.neutral['500']}
              secureTextEntry={false}
              keyboardType="email-address"
            />
          </MotiView>
          <MotiView
            from={{ opacity: 0, bottom: -8 }}
            animate={{ opacity: 1, bottom: 0 }}
            delay={200}
          >
            <ControlledInput
              testID="password-input"
              control={control}
              name="password"
              className="w-min rounded-4xl px-4 text-black"
              style={{ height: 64, backgroundColor: '#b8b8b8' }}
              placeholder="Unesite lozinku"
              placeholderTextColor={colors.neutral['500']}
              secureTextEntry={true}
            />
          </MotiView>
          <MotiView
            from={{ opacity: 0, bottom: -8 }}
            animate={{ opacity: 1, bottom: 0 }}
            delay={250}
          >
            <Button
              testID="login-button"
              variant="secondary"
              className="w-min rounded-4xl bg-primary-500 px-4 text-white"
              style={{ height: 64, marginTop: 10 }}
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
            >
              <Text className="text-2xl" weight="medium">
                {loading ? <ActivityIndicator /> : 'Prijava'}
              </Text>
            </Button>
          </MotiView>
        </View>
        <View className="flex-column w-full" style={{ gap: 3 }}>
          <MotiView
            from={{ opacity: 0, bottom: -8 }}
            animate={{ opacity: 1, bottom: 0 }}
            delay={300}
          >
            <View
              className="w-full flex-row"
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                width,
              }}
            >
              <Text
                className="text-center opacity-50"
                style={{
                  maxWidth: 240,
                  marginTop: 10,
                  lineHeight: 18,
                }}
              >
                Nemate račun?
              </Text>
              <Link href="/onboarding" asChild>
                <Text
                  className="text-center"
                  style={{
                    maxWidth: 240,
                    marginTop: 10,
                    lineHeight: 18,
                    color: colors.primary[500],
                  }}
                >
                  Kreirajte ga!
                </Text>
              </Link>
            </View>
          </MotiView>
        </View>
      </View>

      {/* Image */}
      <MotiView
        from={{ opacity: 0, bottom: -8 }}
        animate={{ opacity: 0.05, bottom: 0 }}
        delay={250}
        className="w-full"
        style={{
          position: 'absolute',
          top: 0,
          width,
          zIndex: -1,
          opacity: 0.05,
        }}
      >
        {assets && assets.length > 0 && (
          <Image
            source={{ uri: assets[0].uri }}
            style={{ width, height: height * 0.7 }}
          />
        )}
      </MotiView>
    </View>
  );
};
