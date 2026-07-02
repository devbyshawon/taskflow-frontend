const TaskCard = ({ task, onStatusChange, isAdmin, onEdit, onDelete }) => {

    return (
        <div className='bg-white rounded p-3 mb-2 shadow-sm'>
            <h4 className='font-medium'>{task.title}</h4>

            {task.description && (
                <p className='text-sm text-gray-500'>
                    {task.description}
                </p>
            )}

            {task.assignedTo && ( 
                <p className='text-xs text-blue-500'>
                    Assigned: {task.assignedTo.name}
                </p>    
            )}

            {task.dueDate && (
                <p className='text-xs text-gray-400'>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
            )}

            <select value={task.status} onChange={(e) => {onStatusChange(task._id, e.target.value);}}>
                <option value='todo'>To Do</option>
                <option value='in-progress'>In Progress</option>
                <option value='done'>Done</option>
            </select>
            
            { isAdmin && (
                <button onClick={() => onEdit(task)}>
                    Edit
                </button>
            )}

            { isAdmin && (
                <button onClick={() => onDelete(task._id)}>
                    Delete
                </button>
            )}
        </div>
    );
};

export default TaskCard;