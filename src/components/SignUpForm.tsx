import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import type { SignUpRequest } from '../types';

const schema = yup.object({
  person: yup.object({
    cpf: yup
      .string()
      .required('CPF é obrigatório')
      .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato: 000.000.000-00'),
    name: yup.string().required('Nome é obrigatório').min(2, 'O nome deve ter ao menos 2 caracteres'),
    email: yup.string().required('Email é obrigatório').email('Formato de email inválido'),
    birth_date: yup.string().required('Data de nascimento é obrigatória'),
  }),
  user: yup.object({
    name: yup.string().required('Nome de usuário é obrigatório').min(3, 'O nome de usuário deve ter ao menos 3 caracteres'),
    password: yup.string().required('Senha é obrigatória').min(6, 'A senha deve ter ao menos 6 caracteres'),
  }),
});

const SignUpForm: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpRequest>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: SignUpRequest) => {
    try {
      await signUp(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      toast.error(message);
    }
  };

  const formatCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-slideInUp">
        <div className="card p-8">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crie sua conta
          </h2>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label htmlFor="person.name" className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <input
                {...register('person.name')}
                type="text"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Your full name"
              />
              {errors.person?.name && (
                <p className="mt-1 text-sm text-red-600">{errors.person.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="person.email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                {...register('person.email')}
                type="email"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="your.email@example.com"
              />
              {errors.person?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.person.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="person.cpf" className="block text-sm font-medium text-gray-700">
                CPF
              </label>
              <input
                {...register('person.cpf')}
                type="text"
                maxLength={14}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="000.000.000-00"
                onChange={(e) => {
                  e.target.value = formatCPF(e.target.value);
                }}
              />
              {errors.person?.cpf && (
                <p className="mt-1 text-sm text-red-600">{errors.person.cpf.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="person.birth_date" className="block text-sm font-medium text-gray-700">
                Data de nascimento
              </label>
              <input
                {...register('person.birth_date')}
                type="date"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.person?.birth_date && (
                <p className="mt-1 text-sm text-red-600">{errors.person.birth_date.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="user.name" className="block text-sm font-medium text-gray-700">
                Usuário
              </label>
              <input
                {...register('user.name')}
                type="text"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Choose a username"
              />
              {errors.user?.name && (
                <p className="mt-1 text-sm text-red-600">{errors.user.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="user.password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                {...register('user.password')}
                type="password"
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Choose a secure password"
              />
              {errors.user?.password && (
                <p className="mt-1 text-sm text-red-600">{errors.user.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex justify-center"
            >
              {isSubmitting ? 'Criando conta...' : 'Criar conta'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Entrar
              </Link>
            </p>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;