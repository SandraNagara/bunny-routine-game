import React, { useState } from 'react';
import { Task } from '../types';
import { Plus, Check, X, Trash2 } from 'lucide-react';

interface PostItProps {
  tasks: Task[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
}

const PostIt: React.FC<PostItProps> = ({ tasks, onAdd, onToggle }) => {
  const [newTask, setNewTask] = useState('');

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
    <div className="absolute left-4 top-32 w-72 bg-yellow-200 shadow-xl transform -rotate-2 rounded-br-3xl p-4 handwritten border-t-8 border-yellow-300/50 animate-float z-20">
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-yellow-400/30 rotate-1"></div>
      
      <h3 className="text-xl font-bold text-yellow-800 mb-2 flex items-center gap-2">
        📝 To-Do List
      </h3>

      <form onSubmit={handleAdd} className="mb-3 flex gap-2">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task..."
          className="flex-1 bg-yellow-100 border-b-2 border-yellow-400 focus:outline-none px-2 py-1 text-sm font-semibold text-yellow-900 placeholder-yellow-500"
        />
        <button type="submit" className="text-yellow-700 hover:bg-yellow-300 p-1 rounded">
          <Plus size={18} />
        </button>
      </form>

      <ul className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide pr-1">
        {tasks.map(task => (
          <li key={task.id} className="flex items-start gap-2 group cursor-pointer" onClick={() => onToggle(task.id)}>
            <div className={`w-5 h-5 border-2 border-yellow-600 rounded flex items-center justify-center transition-colors ${task.completed ? 'bg-yellow-500' : 'bg-transparent'}`}>
               {task.completed && <Check size={14} className="text-white" />}
            </div>
            <span className={`flex-1 text-lg leading-5 transition-all duration-300 ${task.completed ? 'line-through text-yellow-800/40' : 'text-yellow-900'}`}>
              {task.text}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-2 border-t-2 border-yellow-300">
         <div className="flex justify-between text-xs font-bold text-yellow-700 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
         </div>
         <div className="w-full h-2 bg-yellow-100 rounded-full overflow-hidden">
            <div 
                className="h-full bg-green-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
            ></div>
         </div>
      </div>
    </div>
  );
};

export default PostIt;
