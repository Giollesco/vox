import React from 'react';

import { cleanup, fireEvent, render, screen, waitFor } from '@/core/test-utils';

import type { LoginFormProps } from './login-form';
import { LoginForm } from './login-form';

afterEach(cleanup);

const onSubmitMock: jest.Mock<LoginFormProps['onSubmit']> = jest.fn();

describe('LoginForm Form ', () => {
  it('renders correctly', async () => {
    render(<LoginForm />);
    expect(await screen.findByText('Prijavite se')).toBeVisible();
  });

  it('should display required error when values are empty', async () => {
    render(<LoginForm />);

    const button = screen.getByTestId('login-button');
    expect(
      screen.queryByText(/Email adresa je obavezna/i)
    ).not.toBeOnTheScreen();
    fireEvent.press(button);
    expect(
      await screen.findByText(/Email adresa je obavezna/i)
    ).toBeOnTheScreen();
    expect(screen.getByText(/Lozinka je obavezna/i)).toBeOnTheScreen();
  });

  it('should display matching error when email is invalid', async () => {
    render(<LoginForm />);

    const button = screen.getByTestId('login-button');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.changeText(emailInput, 'yyyyy');
    fireEvent.changeText(passwordInput, 'test');
    fireEvent.press(button);

    expect(
      screen.queryByText(/Email adresa je obavezna/i)
    ).not.toBeOnTheScreen();
    expect(
      await screen.findByText(/Unesite ispravnu email adresu/i)
    ).toBeOnTheScreen();
  });

  it('Should call LoginForm with correct values when values are valid', async () => {
    render(<LoginForm onSubmit={onSubmitMock} />);

    const button = screen.getByTestId('login-button');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.changeText(emailInput, 'user@test.com');
    fireEvent.changeText(passwordInput, 'password');
    fireEvent.press(button);
    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1);
    });
    // undefined because we don't use second argument of the  SubmitHandler
    expect(onSubmitMock).toHaveBeenCalledWith(
      {
        email: 'user@test.com',
        password: 'password',
      },
      undefined
    );
  });
});
