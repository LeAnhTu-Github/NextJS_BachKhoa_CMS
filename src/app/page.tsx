"use client";
import NextImage from "next/image";
export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 ">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <NextImage
          src="/images/banner.jpg"
          alt="logo"
          width={500}
          height={500}
        />
        <h1 className="text-2xl font-bold">
          Hệ thống quản trị học lại, thi lại, bảo vệ lại
        </h1>
      </div>
    </div>
  );
}
