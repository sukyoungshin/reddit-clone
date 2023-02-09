import axios from "axios";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import useSWR from 'swr';
import Image from 'next/image';
import { useAuthState } from "../../context/auth";
import SideBar from "../../components/SideBar";

const SubPage = () => {
  const [ownSub, setOwnSub] = useState(false);
  const {authenticated, user} = useAuthState();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const subName = router.query.sub;
  const {data: sub, error} = useSWR(subName ? `/subs/${subName}` : null);

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files === null) return;

    const file = e.currentTarget.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileInputRef.current?.name as unknown as string);

    try {
      await axios.post(`/subs/${sub.name}/upload`, formData, {
        headers: { "Context-Type": "multipart/form-data" }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const openFileInput = (type: 'banner' | 'image' ) => {
    // if (!ownSub) return;

    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };

  useEffect(() => {
    if (!sub || !user) return;
    setOwnSub(authenticated && (user?.username === sub.user));
  }, [sub])

  return (
    <>
        {sub &&
            <>
              <div>
                <input type="file" 
                  hidden={true} 
                  ref={fileInputRef} 
                  onChange={uploadImage} 
                />
                {/* 배너 이미지 */}
                <div className="bg-gray-400">
                  {sub.bannerUrl ? (
                    <div
                      className='h-56 cursor-pointer'
                      style={{
                        backgroundImage: `url(${sub.bannerUrl})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                      onClick={() => openFileInput("banner")}
                    >
                    </div>
                  ) : (
                    <div className='h-20 bg-gray-400 cursor-pointer'
                      onClick={() => openFileInput("banner")}
                    ></div>
                    )}
                  </div>
                  {/* 커뮤니티 메타 데이터 */}
                  <div className='h-20 bg-white'>
                    <div className='relative flex max-w-5xl px-5 mx-auto'>
                      <div className='absolute' style={{ 
                        top: -15, 
                        width: '70px', 
                        height: '70px',
                        display: 'flex'
                      }}>
                        <Image
                          src={sub.imageUrl}
                          alt="커뮤니티 이미지"
                          width={70}
                          height={70}
                          className="rounded-full bg-black cursor-pointer"
                          onClick={() => openFileInput("image")}
                          priority
                        />
                    </div>
                    <div className='pt-1 pl-24'>
                        <div className='flex items-center'>
                          <h1 className='text-3xl font-bold text-black'>{sub.title}</h1>
                        </div>
                        <p className='font-bold text-gray-400 text-small'>
                          /r/{sub.name}
                        </p>
                      </div>
                    </div>
                </div>
              </div>
              {/* 포스트와 사이드바 */}
              <div className='flex max-w-5xl px-4 pt-5 mx-auto'>
                <div className="w-full md:mr-3 md:w-8/12"></div>
                <SideBar sub={sub} />
              </div>
          </>
        }
    </>
    );
}

export default SubPage;
