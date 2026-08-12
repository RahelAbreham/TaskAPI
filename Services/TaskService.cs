using Microsoft.Extensions.Logging;
using TaskApi.DTOs;
using TaskApi.Models;
using TaskApi.Repositories;

namespace TaskApi.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repository;
    private readonly ILogger<TaskService> _logger;

    public TaskService(ITaskRepository repository, ILogger<TaskService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<IEnumerable<TaskResponseDto>> GetAllAsync(Guid userId)
    {
        var tasks = await _repository.GetAllTasksAsync(userId);
        return tasks.Select(MapToDto);
    }

    public async Task<TaskResponseDto?> GetByIdAsync(Guid id, Guid userId)
    {
        var task = await _repository.GetTaskByIdAsync(id, userId);
        return task == null ? null : MapToDto(task);
    }

    public async Task<TaskResponseDto> CreateAsync(CreateTaskDto dto, Guid userId)
    {
        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority ?? "Medium",
            DueDate = dto.DueDate,
            UserId = userId
        };

        var created = await _repository.CreateTaskAsync(task);
        _logger.LogInformation("Task {TaskId} created by user {UserId}", created.Id, userId);
        return MapToDto(created);
    }

    public async Task<TaskResponseDto?> UpdateAsync(Guid id, UpdateTaskDto dto, Guid userId)
    {
        var task = await _repository.GetTaskByIdAsync(id, userId);
        if (task == null) return null;

        task.Title = dto.Title ?? task.Title;
        task.Description = dto.Description ?? task.Description;
        task.Status = dto.Status ?? task.Status;
        task.Priority = dto.Priority ?? task.Priority;
        task.DueDate = dto.DueDate ?? task.DueDate;

        var updated = await _repository.UpdateTaskAsync(task);
        _logger.LogInformation("Task {TaskId} updated by user {UserId}", id, userId);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var deleted = await _repository.DeleteTaskAsync(id, userId);
        if (deleted)
            _logger.LogInformation("Task {TaskId} deleted by user {UserId}", id, userId);
        return deleted;
    }

    private static TaskResponseDto MapToDto(TaskItem task) => new()
    {
        Id = task.Id,
        Title = task.Title,
        Description = task.Description,
        Status = task.Status,
        Priority = task.Priority,
        DueDate = task.DueDate,
        CreatedAt = task.CreatedAt,
        UpdatedAt = task.UpdatedAt
    };
}