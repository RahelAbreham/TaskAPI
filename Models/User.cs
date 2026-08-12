namespace TaskApi.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;

    // Never store plaintext passwords. PasswordHasher<User> (ASP.NET Identity)
    // produces a salted hash here - no separate salt column needed.
    public string PasswordHash { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property - one user has many tasks.
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
