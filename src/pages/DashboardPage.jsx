import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const DashboardPage = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [creating, setCreating] = useState(false);

    const [formError, setFormError] = useState('');

    useEffect (() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects');
                setProjects(response.data)          
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to load projects');
            } finally {
                setLoading(false);
            }
        };
        
        fetchProjects();

    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!newProject.name.trim()) {
            setFormError('Project name is required');
            return;
        }
        setCreating(true);

        try {
            const response = await api.post('/projects', newProject);
            
            setProjects(prev => [...prev, response.data]);
            setNewProject({ name: '', description: ''});
            setShowForm(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        } finally {
            setCreating(false);
        }
    };

    const handleChange = (e) => {
        setNewProject(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            <div className='max-w-5xl mx-auto'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-2xl font-bold text-gray-900'>My Projects</h1>
                    <button 
                        onClick={() => {
                            if (showForm) {
                                setShowForm(false);
                                setFormError('');
                                setNewProject({ name: '', description: '' });
                            } else {
                                setShowForm(true);
                            }
                        }}

                        onClick={() => setShowForm(prev => !prev)} 
                        className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'
                    >
                        {showForm ? 'Cancel' : 'New Project'}
                    </button>
                </div>
            
                
                {showForm && (
                    <div className='bg-white rounded-xl shadow-sm p-6 mb-6'>
                        <h2 className='text-lg font-semibold text-gray-900 mb-4'>New Project</h2>
                        <form onSubmit={handleCreateProject}>
                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Name</label>
                                <input
                                    type='text'
                                    name='name'
                                    value={newProject.name}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Project name'
                                />
                            </div>                   

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                                <input
                                    type='text'
                                    name='description'
                                    value={newProject.description}
                                    onChange={handleChange}
                                    className='w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    placeholder='Project description'
                                />
                            </div>

                            {formError && (
                                <p className='text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg'>{formError}</p>
                            )}
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

                {loading ? (
                    <p>Loading...</p>
                    ) : error ? (
                    <p className='text-red-500'>{error}</p>
                    ) : projects.length === 0 ? (
                    <div className='text-center py-16 text-gray-400'>
                        <p className='text-lg'>No projects yet</p>
                        <p className='text-sm mt-1'>Create your first project to get started</p>
                    </div>
                    ) : (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {projects.map((project) => (
                        <div 
                            key={project._id} 
                            onClick={() => navigate(`/project/${project._id}`)} 
                            className='bg-white rounded-xl shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow border border-gray-100'
                        >
                            <h3 className='font-semibold text-gray-900 mb-1'>{project.name}</h3>
                            <p className='text-sm text-gray-500'>{project.description || 'No description'}</p>
                        </div>
                        ))}
                    </div>
                )}
            </div>                
        </div>
    )
};

export default DashboardPage;