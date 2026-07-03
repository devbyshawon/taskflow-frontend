import TaskCard from "./TaskCard";

const Column = ({ title, tasks, onStatusChange, isAdmin, onEdit, onDelete }) => {
    return (
        <div className='bg-white rounded-xl shadow-sm p-4 min-h-64'>
            <h3 className='font-semibold text-gray-700 mb-3 flex items-center justify-between'>
                {title} 
                <span className='bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full'>
                    ({tasks.length})
                </span>
            </h3>

            {tasks.length === 0 ? (
                <p className='text-gray-400 text-sm'>
                    No tasks here
                </p>
            ) : (
                tasks.map(task => (
                    <TaskCard
                        key={task._id}
                        task={task}
                        onStatusChange={onStatusChange}
                        isAdmin={isAdmin}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))
            )}
        </div>            
    );
};

export default Column;