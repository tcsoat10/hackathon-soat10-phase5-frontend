import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import type { SignInRequest } from '../types';
import Logo from '../assets/logo_abstract_video_unpack';

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const SignInForm: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInRequest>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SignInRequest) => {
    try {
      await signIn(data);
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao realizar login';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-slideInUp">
        {/* Logo */}

        <div className="card p-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Video Unpack
          </h2>
          <div className="flex justify-center mb-6">
            <Logo className="h-20 w-auto" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Faça login na sua conta
          </h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Usuário
              </label>
              <input
                {...register('username')}
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Usuário"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register('password')}
                type="password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex justify-center"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Ainda não tem uma conta?{' '}
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;