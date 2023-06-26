# Admin Example App:

This app highlights the power of Routify 3 in managing user authentication and securing routes.

The **/signin** and **/signout** routes handle the user authentication. Routify 3's role is to redirect users based on their authentication status - post login or logout.

The **/admin** route showcases Routify 3's capacity to secure routes. If an unauthenticated user attempts to access this private route, Routify's load function triggers a redirection to the sign-in page.