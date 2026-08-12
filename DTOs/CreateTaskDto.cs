using System.ComponentModel.DataAnnotations;

namespace TaskApi.DTOs;

public class CreateTaskDto
{
    [Required, StringLength(200, MinimumLength = 1)]
    public string Title { get; set; } = string.Empty;

    [StringLength(2000)]
    public string? Description { get; set; }

    [RegularExpression("^(Low|Medium|High)$", ErrorMessage = "Priority must be Low, Medium, or High.")]
    public string? Priority { get; set; }

    public DateTime? DueDate { get; set; }
}
