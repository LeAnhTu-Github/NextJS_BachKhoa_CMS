'use client'
import React from 'react'
import NextImage from 'next/image'
import '@mdi/font/css/materialdesignicons.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tài khoản'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const router = useRouter()
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const handleTogglePassword = () => setShowPassword((prev) => !prev)

  const onSubmit = async (data: LoginFormData) => {
    const res = await login(data.username, data.password)
    if(res.success){
      toast.success("Đăng nhập thành công")
      router.push('/')
    }else{
      toast.error(res.message)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen w-screen bg-[radial-gradient(#d2f1df,#d3d7fa,#bad8f4)] bg-[length:400%_400%] px-4">
      <div className="w-full col-12 sm:w-8/12 md:w-6/12 lg:w-6/12 xl:w-4/12 min-h-[500px] bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <NextImage src="/images/logobkhn12.png" alt="logo" width={380} height={80} />
        </div>
        <hr className='mx-auto'/>
        <form className='px-2 py-4' onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-base font-semibold text-[#00000099] mb-1"
            >
              Tài khoản <span className="text-red-600 font-bold">(*)</span>
            </label>
            <input
              id="username"
              type="text"
              className={`w-full h-14 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.username
                  ? 'border-red-500 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-blue-200'
              }`}
              placeholder="Nhập tài khoản"
              {...register('username')}
              aria-label="Tài khoản"
              tabIndex={0}
            />
            <div className="h-5 mt-1">
              {errors.username && (
                <p className="text-xs text-red-600">{errors.username.message}</p>
              )}
            </div>
          </div>
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-base font-semibold text-[#00000099] mb-1"
              >
                Mật khẩu <span className="text-red-600 font-bold">(*)</span>
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`w-full px-3 py-2 border h-14 rounded-lg focus:outline-none focus:ring-2 pr-10 ${
                  errors.password
                    ? 'border-red-500 focus:ring-red-200'
                    : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="Nhập mật khẩu"
                {...register('password')}
                aria-label="Mật khẩu"
                tabIndex={0}
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 focus:outline-none"
                tabIndex={0}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                <i className={`mdi ${showPassword ? 'mdi-eye-off' : 'mdi-eye'} text-xl`}></i>
              </button>
            </div>
            <div className="h-5 mt-1">
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>
          </div>
          <div className='flex flex-col justify-between items-end'>
            <a
              href="#"
              className="text-sm text-red-700 hover:underline"
              tabIndex={0}
              aria-label="Quên mật khẩu?"
            >   
              Quên mật khẩu?
            </a>
            <button
              type="submit"
              className="mt-4 w-full h-13 bg-[#A2212B] hover:bg-red-800 text-white font-semibold py-2 rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-200"
              tabIndex={0}
              aria-label="Đăng nhập"
            >
              Đăng Nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage