using System.ComponentModel.DataAnnotations;

namespace TaskApi.DTOs;

public class UpdateTaskDto
{
    [StringLength(200, MinimumLength = 1)]
    public string? Title { get; set; }

    [StringLength(2000)]
    public string? Description { get; set; }

    [RegularExpression("^(Pending|InProgress|Completed)$", ErrorMessage = "Status must be Pending, InProgress, or Completed.")]
    public string? Status { get; set; }

    [RegularExpression("^(Low|Medium|High)$", ErrorMessage = "Priority must be Low, Medium, or High.")]
    public string? Priority { get; set; }

    public DateTime? DueDate { get; set; }
}
