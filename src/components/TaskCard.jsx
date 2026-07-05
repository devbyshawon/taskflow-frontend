const TaskCard = ({ task, onStatusChange, isAdmin, onEdit, onDelete }) => {
    const statusColors = {
        'todo': 'bg-gray-100 text-gray-600',
        'in-progress': 'bg-yellow-100 text-yellow-700',
        'done': 'bg-green-100 text-green-700'
    }

    const statusLabels = {
        'todo': 'To Do',
        'in-progress': 'In Progress', 
        'done': 'Done'
    }

    return (
        <div className='bg-gray-50 rounded-lg p-3 mb-2 border border-gray-100'>
            <h4 className='font-medium text-gray-900 text-sm mb-1'>{task.title}</h4>

            {task.description && (
                <p className='text-xs text-gray-500 mb-2'>
                    {task.description}
                </p>
            )}

            {task.assignedTo && ( 
                <p className='text-xs text-blue-500 mb-2'>
                    👤 {task.assignedTo.name}
                </p>    
            )}

            {task.dueDate && (
                <p className='text-xs text-gray-400 mb-2'>
                    📅 {new Date(task.dueDate).toLocaleDateString()}
                </p>
            )}

            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[task.status]}`}>
                {statusLabels[task.status]}
            </span>

            <select 
                value={task.status} 
                onChange={(e) => onStatusChange(task._id, e.target.value)}
                className='w-full text-xs border border-gray-200 rounded px-2 py-1 mt-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500'    
            >
                <option value='todo'>To Do</option>
                <option value='in-progress'>In Progress</option>
                <option value='done'>Done</option>
            </select>
            
            { isAdmin && (
                <div className='flex gap-2 mt-2'>
                    <button 
                        onClick={() => onEdit(task)}
                        className='text-xs text-blue-600 hover:underline'
                    >
                        Edit
                    </button>

                    <button 
                        onClick={() => onDelete(task._id)}
                        className='text-xs text-red-500 hover:underline'
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskCard;