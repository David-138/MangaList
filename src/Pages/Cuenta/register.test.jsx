import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from './register';
import { describe, it, expect } from 'vitest';
import React from 'react';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  Link: ({ children }) => <>{children}</>,
}));

describe('Componente Register', () => {
  it('Poner correo inválido', () => {
    render(<Register />);
    const emailInputs = screen.getAllByPlaceholderText('Correo electrónico');
    fireEvent.change(emailInputs[0], { target: { value: 'estoSeSupone@queNoDeberíaFuncionar' } });
    const errorMessage = screen.getByText('El correo no tiene un formato válido');
    expect(errorMessage).toBeInTheDocument();
  });

  it('Poner correo válido', () => {
    render(<Register />);
    const emailInputs = screen.getAllByPlaceholderText('Correo electrónico');
    fireEvent.change(emailInputs[0], { target: { value: 'Esto@debería.funcionar' } });
    const errorMessage = screen.queryByText('El correo no tiene un formato válido');
    expect(errorMessage).toBeNull();
  });

  it('Las contraseñas coinciden', async () => {
    render(<Register />);
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirmar contraseña');
    const registerButton = screen.getByText('Registrarse');

    fireEvent.change(passwordInput, { target: { value: 'contraseña' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'contraseña' } });
    fireEvent.click(registerButton);

    const errorMessage = screen.queryByText('Las contraseñas no coinciden');
    expect(errorMessage).toBeNull();
  });

  
  it('Las contraseñas no coinciden y da bien el error', async () => {
    render(<Register />);
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirmar contraseña');
    const registerButton = screen.getByText('Registrarse');

    fireEvent.change(passwordInput, { target: { value: 'contraseña' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'contrasenia' } });
    fireEvent.click(registerButton);

    const errorMessage = await screen.findByText('Las contraseñas no coinciden');
    expect(errorMessage).toBeInTheDocument();
  });

  it('La contraseña es correcta', async () => {
    render(<Register />);
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirmar contraseña');
    const registerButton = screen.getByText('Registrarse');

    fireEvent.change(passwordInput, { target: { value: 'Contraseña1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Contraseña1' } });
    fireEvent.click(registerButton);

    const errorMessage = screen.queryByText('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número');
    expect(errorMessage).toBeNull();
  });

  
  it('La contraseña no es correcta y da bien el error', async () => {
    render(<Register />);
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirmar contraseña');
    const registerButton = screen.getByText('Registrarse');
  
    fireEvent.change(passwordInput, { target: { value: 'EstoNoDeberiaFuncionarYEsperoQueAsiSeaPorqueLlevoMasTiempoConEstoUnicoTestDeLoQueQuieroAdmitir' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'EstoNoDeberiaFuncionarYEsperoQueAsiSeaPorqueLlevoMasTiempoConEstoUnicoTestDeLoQueQuieroAdmitir' } });
    fireEvent.click(registerButton);
    
    const errorMessage = screen.queryByText('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número');
    expect(errorMessage).toBeInTheDocument();
  });
});