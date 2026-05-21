import React from 'react'
import { LoginForm } from '@/components/auth/login-form'
import { useAuthStore } from '@/stores/useAuthStore'
import { Navigate } from 'react-router-dom'

const LoginPage = () => {
  const { user } = useAuthStore();
  const token = localStorage.getItem("access-token");

  if (token && user) {
      return <Navigate to="/" replace />;
  }

  return <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10 absolute inset-0 z-0 bg-gradient-purple">
        <div className="w-full max-w-sm md:max-w-4xl">
            <LoginForm />
        </div>
    </div>;
}

export default LoginPage