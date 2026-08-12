using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskApi.Services;
using TaskApi.DTOs;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;
    private readonly ILogger<TasksController> _logger;

    public TasksController(ITaskService taskService, ILogger<TasksController> logger)
    {
        _taskService = taskService;
        _logger = logger;
    }

    private Guid CurrentUserId =>
        Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTask(Guid id)
    {
        var task = await _taskService.GetByIdAsync(id, CurrentUserId);
        if (task == null) return NotFound();
        return Ok(task);
    }

    [HttpGet]
    public async Task<IActionResult> GetAllTasks()
    {
        var tasks = await _taskService.GetAllAsync(CurrentUserId);
        return Ok(tasks);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
    {
        var createdTask = await _taskService.CreateAsync(dto, CurrentUserId);
        return CreatedAtAction(nameof(GetTask), new { id = createdTask.Id }, createdTask);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(Guid id, [FromBody] UpdateTaskDto dto)
    {
        var updatedTask = await _taskService.UpdateAsync(id, dto, CurrentUserId);
        if (updatedTask == null) return NotFound();
        return Ok(updatedTask);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        var isDeleted = await _taskService.DeleteAsync(id, CurrentUserId);
        if (!isDeleted) return NotFound();
        return NoContent();
    }
}