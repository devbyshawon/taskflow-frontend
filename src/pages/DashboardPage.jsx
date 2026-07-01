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
        setError('');
        if (!newProject.name.trim()) {
            setError('Project name is required');
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
        <>
            <button onClick={() => setShowForm(prev => !prev)}>
                {showForm ? 'Cancel' : 'New Project'}
            </button>

            {showForm && (
                <form onSubmit={handleCreateProject}>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-1'>Name</label>
                        <input
                            type='text'
                            name='name'
                            value={newProject.name}
                            onChange={handleChange}
                            className='w-full border px-3 py-2 rounded'
                            placeholder='Project name'
                        />
                    </div>                   

                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-1'>Description</label>
                        <input
                            type='text'
                            name='description'
                            value={newProject.description}
                            onChange={handleChange}
                            className='w-full border px-3 py-2 rounded'
                            placeholder='Project description'
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={creating}
                        className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50'
                    >
                        {creating ? 'Creating...' : 'Create'}
                    </button>                    
                </form>
            )}

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className='text-red-500'>{error}</p>
            ) : projects.length === 0 ? (
                <p>No projects yet. Create one!</p>
            ) : (
                projects.map((project) => (
                    <div key={project._id} onClick={() => navigate(`/project/${project._id}`)} className='cursor-pointer'>
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                    </div>
                ))
            )}                
        </>
    )
};

export default DashboardPage;