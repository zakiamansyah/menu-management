'use client';

import { useState, useEffect } from 'react';
import MenuList from '../components/MenuList';
import MenuForm from '../components/MenuForm';
import Sidebar from '../components/Sidebar';

import { ChevronDown } from "lucide-react";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  let timer = {}

  const debounce = (id, functional, timeout = 300) => {
    return (...args) => {
      clearTimeout(timer[id])
      timer[id] = setTimeout(() => {
        functional.apply(this, args)
      }, timeout)
    }
  }

  const generateClassLayout = () => {
    if (!isMobile) {
      return isOpen ? 'w-full' : 'w-[calc(100%-280px)]'
    }
    return 'w-full'
  }

  const calculateDeviceSize = () => {
    debounce('init', () => {
      const width = window.innerWidth
      if (width <= 768) {
        setIsMobile(true)
        setIsOpen(true)
      } else {
        setIsMobile(false)
        setIsOpen(false)
      }

    }, 30)()
  }

  useEffect(() => {
    calculateDeviceSize()
    window.addEventListener('resize', calculateDeviceSize)
  });

  return (
    <div className={`relative min-h-screen bg-gray-100`}>
      <Sidebar toogle={isOpen} />
      <div className={`overflow-hidden h-full z-10 ml-auto transition-all duration-500 p-8 ${generateClassLayout()}`}>

      <div className='md:ml-[-80px] ml-[-10px] md:mt-[-25px] md:z-[99999] md:absolute md:bg-transparent p-2 rounded-md cursor-pointer transition-all duration-200 w-10 mb-2' onClick={() => { setIsOpen(!isOpen)}}>
        {isMobile && 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 7H12.5M4 12H14.5M4 17H12.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16.5 8.5L20 12L16.5 15.5" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        }
        {!isMobile && 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 18V16H16V18H3ZM19.6 17L14.6 12L19.6 7L21 8.4L17.4 12L21 15.6L19.6 17ZM3 13V11H13V13H3ZM3 8V6H16V8H3Z" fill="white"/>
        </svg>
        }
      </div>

        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-gray-500 text-sm mb-10">
          <svg
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 16C20 16.5304 19.7893 17.0391 19.4142 17.4142C19.0391 17.7893 18.5304 18 18 18H2C1.46957 18 0.960859 17.7893 0.585786 17.4142C0.210714 17.0391 0 16.5304 0 16V2C0 1.46957 0.210714 0.960859 0.585786 0.585786C0.960859 0.210714 1.46957 0 2 0H7L9 3H18C18.5304 3 19.0391 3.21071 19.4142 3.58579C19.7893 3.96086 20 4.46957 20 5V16Z"
              fill="#D0D5DD"
            />
          </svg>
          <span className="ml-2">/ Menus</span>
        </div>

        {/* Title */}
        {!isMobile && (
          <div className="flex items-center gap-4 mb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3.65625" y="3.66992" width="6.69214" height="6.69336" rx="1" fill="white"/>
              <rect x="3.65625" y="13.6523" width="6.69214" height="6.69336" rx="1" fill="white"/>
              <rect x="13.6539" y="13.6523" width="6.69214" height="6.69336" rx="1" fill="white"/>
              <circle cx="16.9871" cy="7.04102" r="3.69067" fill="white"/>
            </svg>

          </div>
          <h1 className="text-3xl font-extrabold text-black leading-10" style={{ fontFamily: 'Plus Jakarta Sans', letterSpacing: '-0.04em' }}>
            Menus
          </h1>
        </div>
        )}

        {/* Menu Dropdown */}
        <div className='mb-6'>
          <label className="text-gray-500 text-sm">Menu</label>
          <div className="mt-2 flex items-center rounded-lg border border-gray-300 px-4 py-2 w-64 shadow-sm">
            <span className="text-black text-sm">system management</span>
            <ChevronDown className="ml-auto text-gray-400" size={16} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <MenuList />
              <MenuForm />
          </div>

      </div>
    </div>
  );
}