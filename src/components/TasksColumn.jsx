const Column = ({ title, tasks }) => {
    return (
        <div className='bg-gray-100 rounded p-4'>
            <h3 className='font-bold mb-3'>{title} ({tasks.length})</h3>
            {tasks.length === 0 ? (
                <p className='text-gray-400 text-sm'>No tasks here</p>
            ) : (
                tasks.map(task => (
                    <div key={task._id} className='bg-white rounded p-3 mb-2 shadow-sm'>
                        <h4 className='font-medium'>{task.title}</h4>
                        {task.description && 
                            <p className='text-sm text-gray-500'>{task.description}</p>
                        }
                        {task.assignedTo && 
                            <p className='text-xs text-blue-500'>Assigned: {task.assignedTo.name}</p>    
                        }
                        {task.dueDate &&
                            <p className='text-xs text-gray-400'>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                        }
                    </div>
                ))
            )}
        </div>            
    );
};

export default Column;