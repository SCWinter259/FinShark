using System.Security.Claims;

namespace api.Extensions;

public static class ClaimsExtensions
{
    // Gets the username from the claim in the token that we generated
    public static string GetUsername(this ClaimsPrincipal user)
    {
        // We use this URI because that is how Microsoft decided that it should be done
        // weird, but if it works it works
        const string givenNameClaimUri = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
        // suppress warnings because we just know that the string is there
        return user.Claims.SingleOrDefault(x => x.Type.Equals(givenNameClaimUri))!.Value;
    }
}