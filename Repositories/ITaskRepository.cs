using TaskApi.Models;

namespace TaskApi.Repositories
{
    public interface ITaskRepository
    {
        Task<TaskItem?> GetTaskByIdAsync(Guid id, Guid userId);
        Task<IEnumerable<TaskItem>> GetAllTasksAsync(Guid userId);
        Task<TaskItem> CreateTaskAsync(TaskItem task);
        Task<TaskItem> UpdateTaskAsync(TaskItem task);
        Task<bool> DeleteTaskAsync(Guid id, Guid userId);
    }
}