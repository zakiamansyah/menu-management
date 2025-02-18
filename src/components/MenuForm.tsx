'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { fetchMenus } from '../redux/menuSlice';
import { v4 as uuidv4 } from 'uuid';

interface FormData {
  menuId: string;
  depth: number;
  parentId: string;
  parentName: string;
  name: string;
}

export default function MenuForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormData>({
    menuId: uuidv4(),
    depth: 0,
    parentId: '',
    parentName: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch('/api/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.menuId,
          depth: formData.depth,
          parentId: formData.parentId,
          parentName: formData.parentName,
          name: formData.name,
        }),
      });

      setFormData({
        menuId: uuidv4(),
        depth: 0,
        parentId: '',
        parentName: '',
        name: '',
      });

      dispatch(fetchMenus());
    } catch (error) {
      console.error('Failed to create menu item:', error);
    }
  };

  if (typeof window !== 'undefined') {
    (window as any).setMenuFormData = setFormData;
  }

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
  
    const layoutUuid = () => {
        return isMobile ? 'min-w-[262px]' : 'w-full'
    }
  
    const calculateDeviceSize = () => {
      debounce('init', () => {
        const width = window.innerWidth
        if (width <= 768) {
          setIsMobile(true)
        } else {
          setIsMobile(false)
        }
  
      }, 30)()
    }
  
    useEffect(() => {
      calculateDeviceSize()
      window.addEventListener('resize', calculateDeviceSize)
    });

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-blue-gray-50 w-[532px] h-[454px] rounded-2xl p-4"
    >
      <div className='flex flex-col gap-4'>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Menu ID</label>
        <input
          type="text"
          value={formData.menuId}
          readOnly
          className={`h-[52px] min-h-[52px] bg-gray-50 rounded-xl p-4 ${layoutUuid()}`}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Depth</label>
        <input
          type="number"
          value={formData.depth}
          readOnly
          className="w-[262px] h-[52px] min-h-[52px] rounded-[16px] p-[14px_16px] gap-[16px] bg-gray-200"
        />
      </div>

      <input type="hidden" value={formData.parentId} />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Parent Data</label>
        <input
          type="text"
          value={formData.parentName}
          readOnly
          className="w-[262px] h-[52px] min-h-[52px] rounded-[16px] p-[14px_16px] gap-[16px] bg-gray-50"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-[262px] h-[52px] min-h-[52px] rounded-[16px] p-[14px_16px] gap-[16px] bg-gray-50"
          required
        />
      </div>

      <button
        type="submit"
        className="w-[263px] h-[52px] bg-blue-500 text-white rounded-xl hover:bg-blue-600"
      >
        Save
      </button>
      </div>
    </form>
  );
}
