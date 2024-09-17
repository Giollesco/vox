import { Gender } from '@/types';

export const genderToCro: { [gender in Gender]: string } = {
  Male: 'Muško',
  Female: 'Žensko',
};

export const croToGender = {
  Muško: 'Male',
  Žensko: 'Female',
};
