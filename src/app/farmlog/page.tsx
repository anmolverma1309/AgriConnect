'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  dueDate?: string;
}

interface Crop {
  id: string;
  name: string;
  area: number;
  areaUnit: string;
  expectedYield?: number;
  actualYield?: number;
  status: string;
}

export default function FarmlogPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '' });
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const savedCrops = JSON.parse(localStorage.getItem('crops') || '[]');
    setTasks(savedTasks);
    setCrops(savedCrops);
  }, []);

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status: (t.status === 'pending' ? 'completed' : 'pending') as 'pending' | 'completed' } : t);
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: '',
      status: 'pending',
      dueDate: newTask.dueDate
    };
    const updated = [...tasks, task];
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
    setNewTask({ title: '', dueDate: '' });
    setShowAddTask(false);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    localStorage.setItem('tasks', JSON.stringify(updated));
  };

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Farm Log & Tasks</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-semibold">Your Tasks</h2>
              <p className="text-sm text-gray-500">{pendingCount} pending, {completedCount} completed</p>
            </div>
            <button 
              onClick={() => setShowAddTask(!showAddTask)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              + Add Task
            </button>
          </div>

          {showAddTask && (
            <form onSubmit={addTask} className="mb-4 p-4 bg-gray-50 rounded-lg">
              <input 
                type="text" 
                placeholder="Task title"
                className="w-full border rounded px-3 py-2 mb-2"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
              <input 
                type="date" 
                className="w-full border rounded px-3 py-2 mb-2"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">Save</button>
                <button type="button" onClick={() => setShowAddTask(false)} className="bg-gray-300 px-4 py-1 rounded">Cancel</button>
              </div>
            </form>
          )}

          <ul className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tasks yet. Add your first task!</p>
            ) : (
              tasks.map(task => (
                <li key={task.id} className={`flex items-center gap-3 p-3 rounded-lg ${task.status === 'completed' ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <input 
                    type="checkbox" 
                    checked={task.status === 'completed'}
                    onChange={() => toggleTask(task.id)}
                    className="w-5 h-5 text-green-600 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>{task.title}</span>
                    {task.dueDate && (
                      <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Crop Summary</h2>
          <div className="space-y-4">
            {crops.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No crops added yet</p>
                <a href="/planner" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Create Farming Plan
                </a>
              </div>
            ) : (
              crops.map(crop => (
                <div key={crop.id} className="border-b pb-3">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{crop.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${crop.status === 'harvested' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {crop.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Area: {crop.area} {crop.areaUnit} 
                    {crop.expectedYield && `| Expected: ${crop.expectedYield} quintals`}
                    {crop.actualYield && `| Harvested: ${crop.actualYield} quintals`}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Quick Stats</h3>
            <p className="text-sm text-blue-600">Total Crops: {crops.length}</p>
            <p className="text-sm text-blue-600">Pending Tasks: {pendingCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

