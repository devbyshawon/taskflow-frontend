import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'
import Column from '../components/Column';
import { useAuth } from '../context/AuthContext';

const ProjectPage = () => {
    const {id} = useParams();
    const {user} = useAuth();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageError, setPageError] = useState('');
    const [taskFormError, setTaskFormError] = useState('');
    const [editFormError, setEditFormError] = useState('');
    const [memberFormError, setMemberFormError] = useState('');

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [editingTask, setEditingTask] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });

    const [showMemberForm, setShowMemberForm] = useState(false);
    const[addingMember, setAddingMember] = useState(false);
    const [memberEmail, setMemberEmail] = useState('');

    const navigate = useNavigate();


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
                setPageError(error.response?.data?.message || 'Failed to load tasks');   
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
        setTaskFormError('');
        if (!newTask.title.trim()) {
            setTaskFormError('Task title is required');
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
            setTaskFormError(error.response?.data?.message || 'Something went wrong');
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
            setPageError(error.response?.data?.message || 'Something went wrong');
        }
        
    };

    const handleEditStart = (task) => {
        setEditingTask(task);
        setEditForm({ title: task.title, description: task.description,
             assignedTo: task.assignedTo?._id || '', dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''});
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditFormError('');
        if (editForm.title.trim() === '') {
            setEditFormError('Task title is required')
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
            setEditFormError(error.response?.data?.message || 'Something went wrong');
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

            await api.delete(`/tasks/${taskId}`);

            setTasks(prev => prev.filter(t => t._id !== taskId));
        } catch (error) {
            setPageError(error.response?.data?.message || 'Something went wrong');   
        }
    };

    const addMember = async (e) => {
        e.preventDefault();
        setMemberFormError('');
        if (!memberEmail || memberEmail.trim() === '') {
            setMemberFormError('Email is required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(memberEmail)) {
            setMemberFormError('Please enter a valid email address');
            return;
        }

        setAddingMember(true);

        try {
            const response = await api.post(`/projects/${id}/members`, {email: memberEmail});
            setProject(response.data);
            setMemberEmail('');
            setShowMemberForm(false);
        } catch (error) {
            setMemberFormError(error.response?.data?.message || 'Something went wrong'); 
        } finally {
            setAddingMember(false);
        }
    };

    const removeMember = async (memberId) => {
        try {
            await api.delete(`/projects/${id}/members/${memberId}`);
            setProject(prev => ({
                ...prev,
                members: prev.members.filter(m => m.user._id !== memberId)
            }));

            setTasks(prev => prev.map(task => {
                if (task.assignedTo && task.assignedTo._id === memberId) {
                    return { ...task, assignedTo: null };
                }
                return task;
            }));
        } catch (error) {
            setPageError(error.response?.data?.message || 'Something went wrong'); 
        }
        
    };

    if (loading) return <p className='p-6'>Loading...</p>;

    return (
        <div className='min-h-screen bg-gray-100 p-6'>

            {pageError && <p className='text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg'>{pageError}</p>}
            
            <div className='max-w-6xl mx-auto'>

                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-2xl font-bold text-gray-900'>{project?.name}</h1>
                    {isAdmin && (
                        <button 
                        onClick={() => {
                            if (showTaskForm) {
                                setShowTaskForm(false);
                                setTaskFormError('');
                                setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
                            } else {
                                setShowTaskForm(true);
                            }
                        }}
                        className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors'
                        >
                            {showTaskForm ? 'Cancel' : '+ Add Task'}
                        </button>
                    )}
                </div>

                <button 
                    onClick={() => navigate('/dashboard')}
                    className='text-sm text-blue-600 hover:underline mb-2 block'
                >
                    Back to Dashboard
                </button>

                {showTaskForm && (
                    <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
                        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Add Task</h2>
                        <form onSubmit={handleCreateTasks}>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>    
                                <input 
                                    type='text'
                                    name='title'
                                    value={newTask.title}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Task title'
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>    
                                <input 
                                    type='text'                                        
                                    name='description'
                                    value={newTask.description}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Task description'
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Assign To</label>
                                <select 
                                    name='assignedTo' 
                                    value={newTask.assignedTo}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                >
                                    <option value=''>Unassigned</option>
                                    {project?.members?.map(member => (
                                        <option key={member.user._id} value={member.user._id}>
                                            {member.user.name}
                                        </option> 
                                    ))}
                                </select>
                            </div>

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Due Date</label>
                                <input
                                    type='date'
                                    name='dueDate'
                                    value={newTask.dueDate}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>

                            {taskFormError && <p className='text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg'>{taskFormError}</p>}

                            <button
                                type='submit'
                                disabled={creating}
                                className='w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors'
                            >
                                {creating ? 'Creating...' : 'Create'}
                            </button>

                        </form>
                    </div>    
                )}                   
                     
                {editingTask && (
                    <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
                        <h2 className='text-lg font-semibold text-gray-900 mb-4'>Edit Task</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Title</label>
                                <input 
                                    type='text'
                                    name='title'
                                    value={editForm.title}
                                    onChange={handleEditChange}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Task title'
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                                <input
                                    type='text'
                                    name='description'
                                    value={editForm.description}
                                    onChange={handleEditChange}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Task description'
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Assign To</label>
                                <select 
                                    name='assignedTo' 
                                    value={editForm.assignedTo} 
                                    onChange={handleEditChange}
                                    className='w-full text-xs border border-gray-200 rounded px-2 py-1 mt-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500'
                                >
                                    <option value=''>Unassigned</option>
                                    {project?.members?.map(member => (
                                        <option key={member.user._id} value={member.user._id}>
                                            {member.user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Due Date</label>
                                <input
                                    type='date'
                                    name='dueDate'
                                    value={editForm.dueDate}
                                    onChange={handleEditChange}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>

                            {editFormError && <p className='text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg'>{editFormError}</p>}

                            <button
                                type='submit'
                                disabled={updating}
                                className='w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors'
                            >
                                {updating ? 'Updating...' : 'Save Changes'}
                            </button>

                            <button 
                                type='button' 
                                onClick={() => { 
                                    setEditingTask(null);
                                    setEditFormError(''); }}
                                    className='text-sm text-blue-600 hover:underline mt-3'
                            >
                                Cancel
                            </button>

                        </form>
                    </div>    
                )}
                
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                    <Column title = 'To Do' tasks={todoTasks} onStatusChange={updateTaskStatus} isAdmin={isAdmin} 
                    onEdit={handleEditStart} onDelete={deleteTask} />
                    <Column title = 'In Progress' tasks={inProgressTasks} onStatusChange={updateTaskStatus} isAdmin={isAdmin} 
                    onEdit={handleEditStart} onDelete={deleteTask} />
                    <Column title = 'Done' tasks={doneTasks} onStatusChange={updateTaskStatus} isAdmin={isAdmin} 
                    onEdit={handleEditStart} onDelete={deleteTask} />
                </div>

                <div className='bg-white rounded-xl shadow-sm p-6 mt-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-lg font-semibold text-gray-900'>Members</h2>
                        {isAdmin && !showMemberForm && (
                            <button 
                                onClick={() => setShowMemberForm(true)}
                                className='text-sm text-blue-600 hover:underline'
                            >
                                + Add Member
                            </button>
                        )}
                    </div>

                    {showMemberForm && (
                        <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
                            <h2 className='text-lg font-semibold text-gray-900 mb-4'>Add Member</h2>

                            {memberFormError && <p className='text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg'>{memberFormError}</p>}

                            <form onSubmit={addMember} className='flex flex-col sm:flex-row gap-2 mb-4'>
                                <input
                                    type='text'
                                    value={memberEmail}
                                    onChange={(e) => setMemberEmail(e.target.value)}
                                    placeholder='Member email'
                                    className='flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />

                                <button
                                    type='submit' 
                                    disabled={addingMember}
                                    className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors'                        
                                >
                                    {addingMember ? 'Adding...' : 'Add Member'}
                                </button>
                            </form>

                            <button 
                                type='button'
                                onClick={() => {
                                    setShowMemberForm(false);
                                    setMemberFormError('');
                                    setMemberEmail('');
                                }}
                                className='text-sm text-blue-600 hover:underline'
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {project?.members?.map(member => (
                        <div 
                            key={member.user._id}
                            className='flex items-center justify-between py-2 border-b border-gray-100 last:border-0'
                        >

                            <div className='flex items-center gap-2'>

                                <span className='text-sm font-medium text-gray-900'>
                                    {member.user.name}    
                                </span>

                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    member.role === 'admin'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-500'
                                }`}>
                                    {member.role}
                                </span>
                            </div>

                            {isAdmin && member.user._id !== user?._id && (
                                <button 
                                    onClick={() => removeMember(member.user._id)}
                                    className='text-xs text-red-500 hover:underline'
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    ) 
};

export default ProjectPage;