import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import InputGroup from "../components/inputGroup";
import { useAuthState } from "../context/auth";

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();
  const { authenticated } = useAuthState();
  if (authenticated) router.push("/");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/register', {
        email,
        username,
        password
      });
      router.push('/login');
      
    } catch(error: any) {
      console.log('client/src/pages/register', error);
      setErrors(error.response?.data || {});
    }
  }

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-content h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <h1 className="mb-2 text-lg font-medium text-black">회원가입</h1>
          <form onSubmit={handleSubmit}>
            <InputGroup 
              placeholder="Email"
              value={email}
              setValue={setEmail}
              error={errors.email}
            />
            <InputGroup 
              placeholder="Username"
              value={username}
              setValue={setUsername}
              error={errors.username}
            />
            <InputGroup 
              placeholder="Password"
              value={password}
              setValue={setPassword}
              error={errors.password}
            />

            <button className="w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded">
              SIGNUP
            </button>
          </form>
          <small className="text-black">
            이미 가입하셨나요?
            <Link href="/login" className="ml-1 text-blue-500">
              로그인
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Register;
