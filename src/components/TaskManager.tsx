"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Orbitron } from 'next/font/google';
import BackgroundParticles from './BackgroundParticles';
import TaskItem from './TaskItem';
import Footer from './Footer';
import Link from 'next/link';

const orbitron = Orbitron({ subsets: ['latin'] });

// Define task interface
interface Task {
  id: number;
  text: string;
  priority: string;
}

interface CompletedTask extends Task {
  completedAt: Date;
}

export default function TaskManager() {
  // State hooks
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [theme, setTheme] = useState('dark'); // dark, light, navy
  
  // Theme configurations
  const themes = {
    dark: {
      bg: "from-gray-800 to-gray-900",
      header: "text-pink-100",
      input: "bg-gray-900/80 text-white",
      button: "bg-pink-100 hover:bg-pink-200 text-gray-800",
      taskBg: "bg-gray-800/60 text-white",
      taskComplete: "text-pink-200 hover:text-pink-100",
      timeText: "text-gray-400",
      particleColor: "bg-pink-200/10"
    },
    light: {
      bg: "from-gray-100 to-gray-200",
      header: "text-gray-800",
      input: "bg-white/80 text-gray-800",
      button: "bg-gray-800 hover:bg-gray-700 text-white",
      taskBg: "bg-white/80 text-gray-800",
      taskComplete: "text-gray-600 hover:text-gray-800",
      timeText: "text-gray-500",
      particleColor: "bg-gray-400/10"
    },
    navy: {
      bg: "from-gray-900 to-blue-950",
      header: "text-blue-100",
      input: "bg-blue-950/80 text-white",
      button: "bg-blue-400 hover:bg-blue-300 text-gray-900",
      taskBg: "bg-blue-900/50 text-white",
      taskComplete: "text-blue-200 hover:text-blue-100",
      timeText: "text-blue-300/60",
      particleColor: "bg-blue-200/10"
    }
  };
  
  // Update time and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      
      // Format time as HH:MM:SS AM/PM
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      
      // Format date as M/D/YYYY
      const dateString = now.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      });
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };
    
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Add new task
  const handleAddTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { id: Date.now(), text: task, priority: 'normal' }]);
      setTask('');
    }
  };
  
  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };
  
  // Complete a task
  const handleCompleteTask = (taskId: number) => {
    const taskToComplete = tasks.find(t => t.id === taskId);
    if (taskToComplete) {
      setCompletedTasks([...completedTasks, { ...taskToComplete, completedAt: new Date() }]);
      setTasks(tasks.filter(t => t.id !== taskId));
    }
  };
  
  // Change task priority
  const handlePriorityChange = (taskId: number) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const nextPriority = t.priority === 'normal' ? 'high' : t.priority === 'high' ? 'low' : 'normal';
        return { ...t, priority: nextPriority };
      }
      return t;
    }));
  };
  
  // Local Storage to persist data
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    if (savedCompletedTasks) {
      setCompletedTasks(JSON.parse(savedCompletedTasks));
    }
    
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);
  
  // Save to localStorage when tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[theme].bg} flex flex-col items-center justify-center px-4 overflow-hidden transition-colors duration-700 relative`}>
      <BackgroundParticles theme={theme} themeConfig={themes} />
      
      {/* GitHub link in top right with triangle background */}
      <motion.div
        className="absolute top-0 right-0 z-20 w-28 h-28 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link 
          href="https://github.com/OmarNasr-1" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`absolute top-0 right-0 w-full h-full flex items-start justify-end hover:opacity-95 transition-all duration-300 shadow-lg group`}
          title="Visit my GitHub profile"
          style={{ 
            clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
            background: theme === 'dark' 
              ? 'linear-gradient(135deg, rgba(244, 114, 182, 0.2) 0%, rgba(236, 72, 153, 0.3) 100%)' 
              : theme === 'navy' 
                ? 'linear-gradient(135deg, rgba(147, 197, 253, 0.2) 0%, rgba(96, 165, 250, 0.3) 100%)' 
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.3) 100%)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            border: theme === 'dark' 
              ? '1px solid rgba(244, 114, 182, 0.2)' 
              : theme === 'navy' 
                ? '1px solid rgba(147, 197, 253, 0.2)' 
                : '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <div 
            className="absolute top-2 right-2 transform rotate-50 transition-all duration-300 group-hover:scale-110"
            style={{ transformOrigin: 'center center' }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="52" 
              height="52" 
              viewBox="0 0 24 24" 
              className={`${theme === 'light' ? 'text-gray-700' : 'text-white'} transition-colors duration-300`}
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
        </Link>
      </motion.div>
      
      {/* Theme switcher with half-circle icons */}
      <motion.div 
        className="absolute top-4 left-4 flex md:flex-col space-y-3 md:space-y-4 space-x-4 md:space-x-0 z-20"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.button 
          onClick={() => setTheme('dark')}
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center ${theme === 'dark' ? 'ring-2 ring-pink-200 bg-gray-800/50' : 'bg-transparent'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Dark theme"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24" className="text-pink-200">
            <g fill="none">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5"/>
              <path fill="currentColor" d="M16.243 7.757a6 6 0 1 0-8.486 8.486L12 12z"/>
            </g>
          </svg>
        </motion.button>
        
        <motion.button 
          onClick={() => setTheme('light')}
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center ${theme === 'light' ? 'ring-2 ring-gray-400 bg-gray-100/50' : 'bg-transparent'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Light theme"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24" className="text-gray-300  ">
            <g fill="none">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5"/>
              <path fill="currentColor" d="M16.243 7.757a6 6 0 1 0-8.486 8.486L12 12z"/>
            </g>
          </svg>
        </motion.button>
        
        <motion.button 
          onClick={() => setTheme('navy')}
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center ${theme === 'navy' ? 'ring-2 ring-blue-300 bg-blue-900/50' : 'bg-transparent'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Navy theme"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24" className="text-blue-300">
            <g fill="none">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5"/>
              <path fill="currentColor" d="M16.243 7.757a6 6 0 1 0-8.486 8.486L12 12z"/>
            </g>
          </svg>
        </motion.button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl text-center relative z-10"
      >
        <motion.h1 
          className={`text-4xl md:text-7xl font-light mt-28 md:mt-20 md:my-12 ${themes[theme].header} transition-colors duration-700 ${orbitron.className}`}
          initial={{ letterSpacing: "0px" }}
          animate={{ letterSpacing: "5px" }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          
          LET&apos;S DO IT
        </motion.h1>
        
        <div className="relative flex items-center mt-6">
          <motion.textarea
            rows={1}
            maxLength={300}
            autoFocus
            style={{ resize: 'none' }}
            placeholder="Add a task."
            className={`w-full px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-opacity-30 text-xl transition-colors duration-700 ${themes[theme].input} placeholder:text-opacity-60 ${
              theme === 'dark' 
                ? 'placeholder:text-pink-200/60' 
                : theme === 'navy'
                  ? 'placeholder:text-blue-200/60' 
                  : 'placeholder:text-gray-500/70'
            }`}
            value={task}
            onChange={(e) => {
              setTask(e.target.value);
              // Auto adjust height
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            onKeyPress={handleKeyPress}
            initial={{ width: "80%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
          
          <motion.button
            onClick={handleAddTask}
            className={`absolute right-2 px-5 py-3 rounded-xl font-medium text-lg transition-all duration-300 ${themes[theme].button}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            Do it !
          </motion.button>
        </div>
        
        <motion.div 
          className="mt-8 space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          {tasks.length === 0 && (
            <motion.p 
              className={`text-center italic opacity-60 ${themes[theme].header}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.5 }}
            >
              Your tasks will appear here
            </motion.p>
          )}
          
          {tasks.map((item, index) => (
            <TaskItem 
              key={item.id}
              task={item}
              index={index}
              themeConfig={themes}
              theme={theme}
              onComplete={handleCompleteTask}
              onPriorityChange={handlePriorityChange}
            />
          ))}
        </motion.div>
        
        {completedTasks.length > 0 && (
          <div className="mt-8 mb-16">
            <motion.button 
              onClick={() => setShowCompleted(!showCompleted)}
              className={`text-sm ${themes[theme].taskComplete} flex items-center justify-center space-x-1 mx-auto py-2 px-4 rounded-md relative z-10 ${
                theme === 'dark' 
                  ? 'hover:bg-pink-100 hover:text-pink-950' 
                  : theme === 'navy'
                    ? 'hover:bg-blue-100 hover:text-gray-800'
                    : 'hover:bg-white hover:bg-opacity-80 hover:text-gray-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative pointer-events-none">{showCompleted ? 'Hide' : 'Show'} completed ({completedTasks.length})</span>
              <span className="relative pointer-events-none">{showCompleted ? '▲' : '▼'}</span>
            </motion.button>
            
            <AnimatePresence>
              {showCompleted && (
                <motion.div 
                  className="mt-4 space-y-2 overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 0.6 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {completedTasks.map((item) => (
                    <motion.div
                      key={item.id}
                      className={`${themes[theme].taskBg} px-6 py-2 rounded-lg flex justify-between items-center line-through text-sm transition-colors duration-700`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>{item.text}</span>
                      <span className="text-xs opacity-70">
                        {new Date(item.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
        <motion.div 
          className="mt-12 flex flex-wrap justify-center gap-2 sticky bottom-8 pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {tasks.length > 0 && (
            <motion.button 
              onClick={() => setTasks([])}
              className={`hover:cursor-pointer relative z-50 text-sm px-4 py-2 rounded-md ${themes[theme].button} opacity-90 hover:opacity-100 transition-all shadow-md flex items-center space-x-2`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <span>Clear tasks</span>
            </motion.button>
          )}
          
          {completedTasks.length > 0 && (
            <motion.button 
              onClick={() => setCompletedTasks([])}
              className={`relative z-50 hover:cursor-pointer text-sm px-4 py-2 rounded-md ${themes[theme].button} opacity-90 hover:opacity-100 transition-all shadow-md flex items-center space-x-2`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="currentColor" 
                className="w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <span>Clear completed</span>
            </motion.button>
          )}
        </motion.div>
      </motion.div>
      
      {/* Add Footer with theme-based text color */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className={`${themes[theme].timeText} py-10`}
      >
        <Footer />
      </motion.div>
    </div>
  );
}