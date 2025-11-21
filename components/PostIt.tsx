
import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Check, Minus, Maximize2, X } from 'lucide-react';

interface PostItProps {
  tasks: Task[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  isWorking: boolean;
}

const PostIt: React.FC<PostItProps> = ({ tasks, onAdd, onToggle, isWorking }) => {
  const [newTask, setNewTask] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Re-open if work starts and it was hidden (optional, dependent on UX preference)
  // For now, assuming session reset handles visibility or user toggles it back?
  // Prompt says "Minimize or close". We will allow closing.

  if (!isVisible) {
      return (
          <button 
            onClick={() => setIsVisible(true)}
            className="bg-[#FFF078] border-b-4 border-r-4 border-[#E0C040] rounded-lg p-2 hover:scale-105 transition-transform"
            title="Show Tasks"
          >
              <span className="text-2xl">📝</span>
          </button>
      );
  }

  if (isMinimized) {
      return (
        <div className="pointer-events-auto relative">
            <div className="bg-[#FFF078] border-b-4 border-r-4 border-[#E0C040] rounded-xl p-3 w-16 flex flex-col items-center gap-2 shadow-xl cursor-pointer transition-transform hover:scale-105" onClick={() => setIsMinimized(false)}>
                 <span className="text-2xl">📝</span>
                 <div className="w-full h-1 bg-[#E0C040]/30 rounded-full"></div>
                 <Maximize2 size={16} className="text-[#8D6E63]" />
            </div>
        </div>
      )
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAdd(newTask);
      setNewTask('');
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="pointer-events-auto relative w-72 transition-all duration-300 animate-float">
        {/* 3D Pixel Kawaii Container */}
        <div className="bg-[#FFF078] border-b-8 border-r-8 border-[#E0C040] rounded-xl p-5 min-h-[300px] flex flex-col shadow-2xl">
            
            {/* Header with Actions */}
            <div className="flex items-center justify-between mb-4 border-b-4 border-[#E0C040]/20 pb-2 border-dashed">
                <div className="flex items-center gap-2">
                    <span className="text-2xl animate-bounce-slight">📌</span>
                    <h3 className="text-xl font-black text-[#5D4037] title-font tracking-wide">Tasks</h3>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-[#E0C040]/20 rounded text-[#5D4037]">
                        <Minus size={18} strokeWidth={3} />
                    </button>
                    <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-red-400/20 rounded text-[#5D4037] hover:text-red-500">
                        <X size={18} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Input */}
            <form onSubmit={handleAdd} className="mb-4 relative group">
                <input 
                type="text" 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add new task..."
                className="w-full bg-[#FFF9C4] border-2 border-[#E0C040]/30 rounded-lg px-3 py-2 text-sm font-bold text-[#5D4037] placeholder-[#8D6E63]/50 focus:ring-0 focus:border-[#E0C040] focus:outline-none shadow-inner font-handwritten transition-all"
                />
                <button type="submit" className="absolute right-1 top-1 bg-[#E0C040] text-white p-1 rounded-md hover:scale-110 transition-transform shadow-sm">
                    <Plus size={16} strokeWidth={3} />
                </button>
            </form>

            {/* Task List */}
            <ul className="space-y-2 flex-1 overflow-y-auto pr-1 max-h-[200px] custom-scrollbar">
                {tasks.map(task => (
                <li key={task.id} className="flex items-start gap-3 group cursor-pointer p-2 bg-white/30 hover:bg-white/60 rounded-lg transition-all border border-transparent hover:border-[#E0C040]/20" onClick={() => onToggle(task.id)}>
                    <div className={`mt-0.5 w-5 h-5 border-2 border-[#8D6E63] rounded-[6px] flex items-center justify-center transition-all shadow-[2px_2px_0px_0px_rgba(93,64,55,0.2)] ${task.completed ? 'bg-[#8BC34A] border-[#558B2F]' : 'bg-white'}`}>
                        {task.completed && <Check size={14} className="text-white stroke-[4]" />}
                    </div>
                    <span className={`flex-1 text-md font-bold font-handwritten leading-tight transition-all duration-300 select-none ${task.completed ? 'line-through text-[#8D6E63]/50' : 'text-[#5D4037]'}`}>
                        {task.text}
                    </span>
                </li>
                ))}
                {tasks.length === 0 && (
                    <li className="text-center text-[#8D6E63]/50 text-sm font-bold italic py-4">
                        No tasks yet! Let's work! 💪
                    </li>
                )}
            </ul>

            {/* Footer Progress */}
            <div className="mt-4 pt-2 border-t-4 border-[#E0C040]/20 border-dashed">
                <div className="flex justify-between text-[10px] font-black text-[#5D4037]/60 uppercase mb-1 tracking-wider">
                    <span>XP Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-3 bg-[#FFF9C4] rounded-full overflow-hidden border border-[#E0C040]/30 shadow-inner">
                    <div 
                        className="h-full bg-gradient-to-r from-[#FFA726] to-[#FF7043] transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PostIt;
