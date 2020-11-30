namespace Camekan.DataAccess
{
    public interface ITokenService
    {
        string CreateToken(AppUser appUser);
    }
}
