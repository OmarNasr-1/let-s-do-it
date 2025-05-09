"use client"

import { motion } from 'framer-motion';
import { useState } from 'react';

interface TaskItemProps {
  task: {
    id: number;
    text: string;
    priority: string;
  };
  index: number;
  themeConfig: any;
  theme: string;
  onComplete: (id: number) => void;
  onPriorityChange: (id: number) => void;
}

export default function TaskItem({ 
  task, 
  index, 
  themeConfig, 
  theme, 
  onComplete, 
  onPriorityChange 
}: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine if text is long (more than 200 characters)
  const isLongText = task.text.length > 200;
  
  // Get priority badge styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': 
        return {
          bg: 'bg-red-500/20',
          border: 'border-red-500/30',
          text: 'text-red-400',
          label: 'High Priority'
        };
      case 'low': 
        return {
          bg: 'bg-green-500/20',
          border: 'border-green-500/30',
          text: 'text-green-400',
          label: 'Low Priority'
        };
      default: 
        return {
          bg: 'bg-yellow-500/20',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400',
          label: 'Normal Priority'
        };
    }
  };
  
  // Get checkbox theme-specific colors
  const getCheckboxStyle = (theme: string, isHovered: boolean) => {
    if (!isHovered) {
      return 'border-gray-400 border-opacity-50';
    }
    
    switch (theme) {
      case 'dark':
        return 'border-pink-300 bg-gray-700/80';
      case 'light':
        return 'border-gray-500 bg-gray-100/90';
      case 'navy':
        return 'border-blue-300 bg-blue-900/80';
      default:
        return 'border-gray-400 bg-gray-800/80';
    }
  };
  
  // Get checkmark color based on theme
  const getCheckmarkColor = (theme: string) => {
    switch (theme) {
      case 'dark': return 'text-pink-200';
      case 'light': return 'text-gray-700';
      case 'navy': return 'text-blue-200';
      default: return 'text-white';
    }
  };
  
  const priorityStyle = getPriorityBadge(task.priority);
  const checkboxStyle = getCheckboxStyle(theme, isHovered);
  const checkmarkColor = getCheckmarkColor(theme);
  
  return (
    <motion.div
      key={task.id}
      className={`${themeConfig[theme].taskBg} p-4 rounded-lg flex flex-col transition-colors duration-700`}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Task Text - Always on its own row */}
      <div className="w-full break-words mb-3">
        <span className="transition-colors duration-300 text-left block">
          {task.text}
        </span>
      </div>
      
      {/* Controls - Always on a new row, aligned to the right */}
      <div className="flex items-center justify-end space-x-3 ml-auto">
        <motion.button 
          onClick={() => onPriorityChange(task.id)}
          className={`text-xs px-2 py-1 rounded-full ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border} border transition-colors flex items-center justify-center`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Change priority"
        >
          {priorityStyle.label}
        </motion.button>
        
        <button 
          onClick={() => onComplete(task.id)}
          className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all duration-300 ${checkboxStyle}`}
          title="Mark as completed"
        >
          {isHovered && (
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className={`w-4 h-4 ${checkmarkColor}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
            </motion.svg>
          )}
        </button>
      </div>
    </motion.div>
  );
}