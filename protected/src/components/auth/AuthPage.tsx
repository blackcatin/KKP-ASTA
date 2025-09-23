import LoginForm from './LoginForm';
import Illustration from './Illustrations';
import { useState } from 'react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const toggleForm = () => {
        setIsLogin(!isLogin);
    }

    return (
        <div className="flex w-screen min-h-screen">
            <div className="relative items-center justify-center hidden w-1/2 p-10 overflow-hidden md:flex bg-gray-50">
                <Illustration />
            </div>
            <div className="flex items-center justify-center w-full px-4 bg-white md:w-1/2">
                <LoginForm onToggleForm={toggleForm} />
            </div>
        </div>
    )
}