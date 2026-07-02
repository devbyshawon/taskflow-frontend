import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api'
import Column from '../components/Column';
import { useAuth } from '../context/AuthContext';


const ProjectPage = () => {
    const {id} = useParams();
    const {user} = useAuth();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [editingTask, setEditingTask] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });


    useEffect (() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [projectData, tasksData] = await Promise.all([
                    api.get(`/projects/${id}`),
                    api.get(`/projects/${id}/tasks`)
                ]);
                setProject(projectData.data);
                setTasks(tasksData.data);
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to load tasks');   
            } finally {
                setLoading(false);
            }
        };

        fetchData();

    }, [id]);

    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const doneTasks = tasks.filter(t => t.status === 'done');

    const currentMember = project?.members?.find(m => {
        return m.user._id.toString() === user?._id;
    });
    const isAdmin = currentMember?.role === 'admin';

    const handleCreateTasks = async (e) => {
        e.preventDefault();
        setError('');
        if (!newTask.title.trim()) {
            setError('Task title is required');
            return;
        }
        setCreating(true);

        const { title, description, assignedTo, dueDate } = newTask;
        const body = { title, description };
        if (assignedTo) {
            body.assignedTo = assignedTo;
        }
        if (dueDate) {
            body.dueDate = dueDate;
        }

        try {
            const response = await api.post(`/projects/${id}/tasks`, body);
            setTasks(prev => ([ ...prev, response.data ]));
            setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
            setShowTaskForm(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setCreating(false);
        }

    };

    const handleChange = (e) => {
        setNewTask(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            const response = await api.put(`/tasks/${taskId}`, {status: newStatus});
            setTasks(prev => 
                prev.map(task => {
                    if (task._id === taskId) {
                        return response.data;
                    } 

                    return task;

                }))
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        }
        
    };

    const handleEditStart = (task) => {
        setEditingTask(task);
        setEditForm({ title: task.title, description: task.description,
             assignedTo: task.assignedTo?._id || '', dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''});
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (editForm.title.trim() === '') {
            setError('Task title is required')
            return;
        }
        setUpdating(true) 

        const { title, description, assignedTo, dueDate } = editForm;
        const body = { title, description };
        if (assignedTo) {
            body.assignedTo = assignedTo;
        }
        if (dueDate) {
            body.dueDate = dueDate;
        }

        try {
            const response = await api.put(`/tasks/${editingTask._id}`, body);
            setTasks(prev => prev.map(t => t._id === editingTask._id ? response.data : t));
            setEditingTask(null)
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setUpdating(false)
        }

    }

    const handleEditChange = (e) => {
        setEditForm(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const deleteTask = async (taskId) => {
        try {
            const result = window.confirm("Delete this task?");
            if (!result) return;

            const response = await api.delete(`/tasks/${taskId}`);

            setTasks(prev => prev.filter(t => t._id !== taskId));
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');   
        }
    }

    //prevents the grid from rendering with empty data while the fetch is in flight
    if (loading) return <p className='p-6'>Loading...</p>;

    return (
        <div>
            {error && <p className='text-red-500 mb-4'>{error}</p>}

            <h2>{project?.name}</h2>

            <button onClick={() => setShowTaskForm(prev => !prev)}>
                {showTaskForm ? 'Cancel' : 'Add Task'}
            </button>

            {showTaskForm && (
                <form onSubmit={handleCreateTasks}>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-1'>Title</label>
                        <input 
                            type='text'
                            name='title'
                            value={newTask.title}
                            onChange={handleChange}
                            className='w-full border px-3 py-2 rounded'
                            placeholder='Task title'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-1'>Description</label>
                        <input
                            type='text'
                            name='description'
                            value={newTask.description}
                            onChange={handleChange}
                            className='w-full border px-3 py-2 rounded'
                            placeholder='Task description'
                        />
                    </div>

                    <select name='assignedTo' value={newTask.assignedTo} onChange={handleChange}>
                        <option value=''>Unassigned</option>
                        {project?.members?.map(member => (
                            <option key={member.user._id} value={member.user._id}>
                                {member.user.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type='date'
                        name='dueDate'
                        value={newTask.dueDate}
                        onChange={handleChange}
                    />

                    <button
                        type='submit'
                        disabled={creating}
                        className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50'
                    >
                        {creating ? 'Creating...' : 'Create'}
                    </button>  
                </form>
            )}

            {editingTask && (
                <form onSubmit={handleEditSubmit}>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-1'>Title</label>
                        <input 
                            type='text'
                            name='title'
                            value={editForm.title}
                            onChange={handleEditChange}
                            className='w-full border px-3 py-2 rounded'
                            placeholder='Task title'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-1'>Description</label>
                        <input
                            type='text'
                            name='description'
                            value={editForm.description}
                            onChange={handleEditChange}
                            className='w-full border px-3 py-2 rounded'
                            placeholder='Task description'
                        />
                    </div>

                    <select name='assignedTo' value={editForm.assignedTo} onChange={handleEditChange}>
                        <option value=''>Unassigned</option>
                        {project?.members?.map(member => (
                            <option key={member.user._id} value={member.user._id}>
                                {member.user.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type='date'
                        name='dueDate'
                        value={editForm.dueDate}
                        onChange={handleEditChange}
                    />

                    <button
                        type='submit'
                        disabled={updating}
                        className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50'
                    >
                        {updating ? 'Updating...' : 'Save Changes'}
                    </button>  

                    <button type='button' onClick={() => setEditingTask(null)}>
                        Cancel
                    </button>
                </form>
            )}            

            <div className='grid grid-cols-3 gap-4'>
                <Column title = 'To Do' tasks={todoTasks} onStatusChange={updateTaskStatus} isAdmin={isAdmin} 
                onEdit={handleEditStart} onDelete={deleteTask} />
                <Column title = 'In Progress' tasks={inProgressTasks} onStatusChange={updateTaskStatus} isAdmin={isAdmin} 
                onEdit={handleEditStart} onDelete={deleteTask} />
                <Column title = 'Done' tasks={doneTasks} onStatusChange={updateTaskStatus} isAdmin={isAdmin} 
                onEdit={handleEditStart} onDelete={deleteTask} />
            </div>
        </div>
    ) 
};

export default ProjectPage;