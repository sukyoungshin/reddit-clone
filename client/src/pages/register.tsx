import Link from "next/link";
import React from "react";

const Register = () => {
  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-content h-screen p-6">
        <div className="w-10/12 mx-auto md:w-96">
          <h1 className="mb-2 text-lg font-medium text-black">회원가입</h1>
          <form>
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
