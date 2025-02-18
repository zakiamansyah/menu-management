'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchMenus } from '../redux/menuSlice';
import { PlusCircleIcon, ChevronDownIcon, ChevronRightIcon, MinusCircleIcon } from '@heroicons/react/24/outline';
import { v4 as uuidv4 } from 'uuid';

interface MenuItem {
  id: string;
  name: string;
  children: MenuItem[];
  depth: number;
  parentId: string | null;
  parentName: string | null;
}

const MenuItemComponent = ({ 
  item, 
  onDelete, 
  onEdit, 
  onAddSubmenu, 
  expanded, 
  onToggle 
}: { 
  item: MenuItem;
  onDelete: (id: string) => void;
  onEdit: (item: MenuItem) => void;
  onAddSubmenu: (parentItem: MenuItem) => void;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="relative">
      {/* Parent item container */}
      <div className="flex items-center relative group p-2">
        {/* Vertical Line for Hierarchy */}
        {item.depth > 0 && (
          <div
            className="absolute border-b-2 border-gray-300"
            style={{ width: '20px', left: '-15px', top: '50%' }}
          />
        )}

        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button onClick={onToggle} className="mr-2 text-gray-700 hover:text-gray-900">
            {expanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
          </button>
        )}

        {/* Menu Item Name */}
        <span className="text-gray-900 flex-1">{item.name}</span>

        {/* Action Buttons */}
        <button
          onClick={() => onAddSubmenu(item)}
          className="px-2 py-1 bg-blue-500 text-white rounded-full mr-2 text-sm"
          title="Add submenu"
        >
          <PlusCircleIcon className="h-5 w-5" />
        </button>
        {/* <button
          onClick={() => onEdit(item)}
          className="px-2 py-1 bg-blue-500 text-white rounded mr-2 text-sm"
        >
          Edit
        </button> */}
        <button
          onClick={() => onDelete(item.id)}
          className="px-2 py-1 bg-red-500 text-white rounded-full text-sm"
        >
          <MinusCircleIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Render Children Recursively */}
      {expanded && (
        <div className="ml-6 border-l-2 border-gray-300 pl-4">
          {item.children.map((child) => (
            <MenuItemComponent
              key={child.id}
              item={child}
              onDelete={onDelete}
              onEdit={onEdit}
              onAddSubmenu={onAddSubmenu}
              expanded={expanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

function buildTree(items: MenuItem[]): MenuItem[] {
  const itemMap = new Map<string, MenuItem>();

  if (Array.isArray(items)) {
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });
  }

  const tree: MenuItem[] = [];

  if (Array.isArray(items)) {
    items.forEach(item => {
      if (item.parentId) {
        const parent = itemMap.get(item.parentId);
        if (parent) {
          parent.children.push(itemMap.get(item.id)!);
        }
      } else {
        tree.push(itemMap.get(item.id)!);
      }
    });
  }

  return tree;
}

export default function MenuList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.menu);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    dispatch(fetchMenus());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/menus/${id}`, {
        method: 'DELETE',
      });
      dispatch(fetchMenus());
    } catch (error) {
      console.error('Failed to delete menu item:', error);
    }
  };

  const handleEdit = (item: MenuItem) => {
    console.log('Edit item:', item);
  };

  const handleAddSubmenu = (parentItem: MenuItem) => {
    const randomId = uuidv4();
    
    const setMenuFormData = (window as any).setMenuFormData;
    if (setMenuFormData) {
      setMenuFormData({
        menuId: randomId,
        depth: parentItem.depth + 1,
        parentId: parentItem.id,
        parentName: parentItem.name,
        name: '',
      });
    }
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const addIds = (items: MenuItem[]) => {
      items.forEach(item => {
        allIds.add(item.id);
        if (item.children) {
          addIds(item.children);
        }
      });
    };
    addIds(items);
    setExpandedItems(allIds);
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const menuTree = buildTree(items);

  return (
    <div className="rounded-lg p-4 w-[310px] h-[710px]">
      <div className="flex justify-between mb-4">
        <button
          onClick={expandAll}
          className="px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-700"
        >
          Expand All
        </button>
        <button
          onClick={collapseAll}
          className="px-4 py-2 bg-gray-300 text-black rounded-full hover:bg-gray-600 border border-gray-300"
        >
          Collapse All
        </button>
      </div>
      <div className="text-sm text-gray-900">
        {menuTree.map((item) => (
          <MenuItemComponent
            key={item.id}
            item={item}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onAddSubmenu={handleAddSubmenu}
            expanded={expandedItems.has(item.id)}
            onToggle={() => toggleExpand(item.id)}
          />
        ))}
      </div>
    </div>
  );
}