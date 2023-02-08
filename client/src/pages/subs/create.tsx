import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { FormEvent, useState } from "react";
import InputGroup from "../../components/inputGroup";

const SubCreate = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<any>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("/subs", {name, title, description});
      router.push(`/r/${res.data.name}`);

    } catch(error: any) {
      console.log(error);
      setErrors(error.response?.data);
    }
  };

  return (
    <div className="flex fle-col justify-center pt-16">
      <div className="w-10/12 mx-auto md:w-96">
        <h1 className="mb-2 text-lg font-medium">
          커뮤니티 만들기
        </h1>
        <hr/>
        <form onSubmit={handleSubmit}>
          <div className="my-6">
            <p className="font-medium">Name</p>
            <p className="mb-2 text-xs text-gray-400">커뮤니티 이름은 변경할 수 없습니다.</p>
            <InputGroup 
              placeholder="이름" 
              value={name} 
              setValue={setName} 
              error={errors.name} />
          </div>
          <div className="my-6">
            <p className="font-medium">Title</p>
            <p className="mb-2 text-xs text-gray-400">주제를 나타냅니다. 언제든지 변경할 수 있습니다.</p>
            <InputGroup 
              placeholder="제목" 
              value={title} 
              setValue={setTitle} 
              error={errors.title} />
          </div>
          <div className="my-6">
            <p className="font-medium">Description</p>
            <p className="mb-2 text-xs text-gray-400">해당 커뮤니티에 대한 설명입니다.</p>
            <InputGroup 
              placeholder="설명" 
              value={description} 
              setValue={setDescription} 
              error={errors.description} />
          </div>
          <div className="flex justify-end">
            <button className="px-4 py-1 text-sm font-semibold rounded text-white bg-gray-400 border">
              커뮤니티 만들기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default SubCreate;

export const getServerSideProps: GetServerSideProps = async ({ res, req }) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie) throw new Error('Missing auth token cookie.');

    // 쿠키가 있다면 백앤드에서 인증처리 하기
    await axios.get("/auth/me", { headers: { cookie }});
    return { props: {} };
    
  } catch (error) {
    // 백앤드에서 요청해서 던져준 쿠키를 이용해 인증처리 할 때, 에러가 나면 /login으로 이동
    res.writeHead(307, {location: "/login"}).end();
    return { props: {} };    
  }
}