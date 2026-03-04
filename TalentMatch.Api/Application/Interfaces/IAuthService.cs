namespace TalentMatch.Api.Application.Interfaces
{
    public interface IAuthService
    {
        Task<Guid> RegisterAsync(string email, string password);
        Task<string> LoginAsync(string email, string password);
    }
}
