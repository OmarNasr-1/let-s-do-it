# Task Manager App with Next.js App Router - Step-by-Step Instructions

This guide will help you create an animated task manager application using Next.js App Router, Tailwind CSS, and Framer Motion.

## Project Setup

1. **Create a New Next.js Project**

```bash
npx create-next-app@latest task-manager
```

When prompted, select:
- ✅ Would you like to use TypeScript? - Yes
- ✅ Would you like to use ESLint? - Yes
- ✅ Would you like to use Tailwind CSS? - Yes
- ✅ Would you like to use the `src/` directory? - Yes
- ✅ Would you like to use the App Router? - Yes
- ✅ Would you like to customize the default import alias? - No

2. **Install Required Dependencies**

```bash
cd task-manager
npm install framer-motion
```

## Project Structure

Create the following folder structure:

```
task-manager/
├── src/
│   ├── app/
│   │   ├── page.tsx (main app page)
│   │   ├── layout.tsx (app layout)
│   │   ├── globals.css
│   ├── components/
│   │   ├── TaskManager.tsx (main component)
│   │   ├── BackgroundParticles.tsx (background animation)
│   │   ├── TaskItem.tsx (individual task component)
```

## Implementation Steps

### 1. Set Up the App Layout

Replace the content of `src/app/layout.tsx` with:

```tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Task Manager | let's do it',
  description: 'A minimalist task manager application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

### 2. Create the Main App Page

Update `src/app/page.tsx` with:

```tsx
"use client"

import TaskManager from '@/components/TaskManager'

export default function Home() {
  return (
    <main>
      <TaskManager />
    </main>
  )
}
```

### 3. Create the Background Particles Component

Create `src/components/BackgroundParticles.tsx`:

```tsx
import { motion } from 'framer-motion';

interface BackgroundParticlesProps {
  theme: string;
  themeConfig: any;
}

export default function BackgroundParticles({ theme, themeConfig }: BackgroundParticlesProps) {
  const particleCount = 20;
  const particles = Array(particleCount).fill(0).map((_, i) => i);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((i) => {
        const size = Math.floor(Math.random() * 8) + 4;
        const duration = Math.floor(Math.random() * 25) + 15;
        const delay = Math.random() * 20;
        
        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${themeConfig[theme].particleColor}`}
            style={{
              width: size,
              height: size,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -Math.random() * 300 - 100],
              x: [0, (Math.random() - 0.5) * 200],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </div>
  );
}
```

### 4. Create the Task Item Component

Create `src/components/TaskItem.tsx`:

```tsx
import { motion } from 'framer-motion';

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
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'low': return 'text-green-400';
      default: return 'text-white';
    }
  };
  
  return (
    <motion.div
      key={task.id}
      className={`${themeConfig[theme].taskBg} px-6 py-3 rounded-lg flex justify-between items-center transition-colors duration-700`}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <span className={`${getPriorityColor(task.priority)} transition-colors duration-300`}>
        {task.text}
      </span>
      <div className="flex space-x-3">
        <button 
          onClick={() => onPriorityChange(task.id)}
          className="text-gray-400 hover:text-yellow-300 transition-colors"
          title="Change priority"
        >
          {task.priority === 'high' ? '!!' : task.priority === 'low' ? '·' : '!'}
        </button>
        <button 
          onClick={() => onComplete(task.id)}
          className={`${themeConfig[theme].taskComplete} transition-colors`}
        >
          ✓
        </button>
      </div>
    </motion.div>
  );
}
```

### 5. Create the Main Task Manager Component

Create `src/components/TaskManager.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BackgroundParticles from './BackgroundParticles';
import TaskItem from './TaskItem';

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
  
  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[theme].bg} flex flex-col items-center justify-center px-4 overflow-hidden transition-colors duration-700`}>
      <BackgroundParticles theme={theme} themeConfig={themes} />
      
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg text-center relative z-10"
      >
        <motion.h1 
          className={`text-8xl font-light mb-12 ${themes[theme].header} transition-colors duration-700`}
          initial={{ letterSpacing: "0px" }}
          animate={{ letterSpacing: "5px" }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          let's do it.
        </motion.h1>
        
        <div className="relative flex items-center mt-6">
          <motion.input
            type="text"
            placeholder="Add a task."
            className={`w-full px-6 py-4 rounded-full outline-none focus:ring-2 focus:ring-opacity-30 text-xl transition-colors duration-700 ${themes[theme].input}`}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyPress={handleKeyPress}
            initial={{ width: "80%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.5, delay: 0.8 }}
          />
          
          <motion.button
            onClick={handleAddTask}
            className={`absolute right-0 px-5 py-2 rounded-full font-medium text-lg transition-all duration-300 ${themes[theme].button}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            I Got This!
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
          <motion.div className="mt-8" layout>
            <button 
              onClick={() => setShowCompleted(!showCompleted)}
              className={`text-sm ${themes[theme].taskComplete} flex items-center justify-center space-x-1 mx-auto`}
            >
              <span>{showCompleted ? 'Hide' : 'Show'} completed ({completedTasks.length})</span>
              <span>{showCompleted ? '▲' : '▼'}</span>
            </button>
            
            {showCompleted && (
              <motion.div 
                className="mt-4 space-y-2 opacity-60"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 0.6 }}
                transition={{ duration: 0.3 }}
              >
                {completedTasks.map((item) => (
                  <motion.div
                    key={item.id}
                    className={`${themes[theme].taskBg} px-6 py-2 rounded-lg flex justify-between items-center line-through text-sm transition-colors duration-700`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <span>{item.text}</span>
                    <span className="text-xs opacity-70">
                      {new Date(item.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
        
        <motion.div 
          className={`mt-16 text-sm ${themes[theme].timeText} transition-colors duration-700`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.6 }}
        >
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {currentDate}, {currentTime}
          </motion.span>
        </motion.div>
        
        <motion.div 
          className="flex space-x-4 justify-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <motion.button 
            onClick={() => setTheme('dark')}
            className={`w-8 h-8 bg-gray-800 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 ${theme === 'dark' ? 'ring-2 ring-pink-200' : ''}`}
            whileTap={{ scale: 0.9 }}
          />
          <motion.button 
            onClick={() => setTheme('light')}
            className={`w-8 h-8 bg-white rounded-full cursor-pointer transition-all duration-300 hover:scale-110 ${theme === 'light' ? 'ring-2 ring-gray-400' : ''}`}
            whileTap={{ scale: 0.9 }}
          />
          <motion.button 
            onClick={() => setTheme('navy')}
            className={`w-8 h-8 bg-blue-950 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 ${theme === 'navy' ? 'ring-2 ring-blue-300' : ''}`}
            whileTap={{ scale: 0.9 }}
          />
        </motion.div>
        
        <motion.div 
          className="mt-6 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <button 
            onClick={() => setTasks([])}
            className={`text-xs px-3 py-1 rounded-full ${themes[theme].taskComplete} opacity-60 hover:opacity-100 transition-all`}
            style={{ display: tasks.length ? 'block' : 'none' }}
          >
            Clear all
          </button>
          
          <button 
            onClick={() => setCompletedTasks([])}
            className={`text-xs px-3 py-1 rounded-full ${themes[theme].taskComplete} opacity-60 hover:opacity-100 transition-all`}
            style={{ display: completedTasks.length ? 'block' : 'none' }}
          >
            Clear completed
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
```

## Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and visit `http://localhost:3000`

## Key Features Implemented

- ✅ Responsive design with Tailwind CSS
- ✅ Animated components with Framer Motion
- ✅ Infinite floating background animation
- ✅ Theme switching via color circles
- ✅ Task priority management
- ✅ Completed task history
- ✅ Live clock and date display
- ✅ Task management features (add, complete, clear)

## Additional Configuration Options

### Custom Fonts

To use custom fonts, update the `layout.tsx` file and import your preferred Google Font or local font.

### Local Storage

To persist tasks between sessions, you can add local storage functionality:

```tsx
// Add to TaskManager.tsx

// Load tasks from localStorage on component mount
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

// Save tasks to localStorage whenever they change
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}, [tasks]);

useEffect(() => {
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}, [completedTasks]);

useEffect(() => {
  localStorage.setItem('theme', theme);
}, [theme]);
```

### Deployment

To deploy your application:

1. Build the project:

```bash
npm run build
```

2. Deploy to Vercel (easiest option):

```bash
npm install -g vercel
vercel
```

Or deploy to other platforms like Netlify, AWS Amplify, or GitHub Pages.

## Troubleshooting

- If you encounter TypeScript errors, make sure you've properly defined all types.
- If animations aren't working, check that Framer Motion is correctly installed.
- For styling issues, verify your Tailwind configuration in `tailwind.config.js`.

## Next Steps

- Add drag-and-drop functionality for task reordering
- Implement categories or tags for tasks
- Add user authentication
- Create a backend API for data persistence