import TaskCard from "./TaskCard";

const Column = ({ title, tasks, onStatusChange, isAdmin, onEdit, onDelete }) => {
    return (
        <div className='bg-gray-100 rounded p-4'>
            <h3 className='font-bold mb-3'>
                {title} ({tasks.length})
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