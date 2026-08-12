using TaskApi.DTOs;

namespace TaskApi.Services;

public interface ITaskService
{
    Task<IEnumerable<TaskResponseDto>> GetAllAsync(Guid userId);
    Task<TaskResponseDto?> GetByIdAsync(Guid id, Guid userId);
    Task<TaskResponseDto> CreateAsync(CreateTaskDto dto, Guid userId);
    Task<TaskResponseDto?> UpdateAsync(Guid id, UpdateTaskDto dto, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}