How it works
The authorization will create two tokens that store
{
  id: string,
  name: string
  role: regular | administrator | boss
}.
But roles are not dynamically updated. Because the logic for regular and boss is the same, and the administrator has no way to change the role. So now it is not reasonable to load the database every few minutes (how long one token lives). One token is refresh, and the second is access. The refresh is stored in a secure cookie which cannot be retrieved from the client with js it lives for 30 days. The second is the access token. It is usually stored in localstorage. And it is sent at every http request. I set it to live for 5 minutes.
At each request tokens are accessed from the cookie and authorization header.
If at least one token is missing, the authorization logic is skipped. If the tokens are not expired and match. The information is sent to req.customAuth. If an error occurs during this process, a check is made and if they are invalid or do not match, the cookie is deleted. If the access token has expired, a new pair is created and replaced in the database. If refresh expired, both are deleted.

I could also write an access token checker. But that would complicate the code, reduce the speed of checking the test assignment since you would have to change it in the http headers every few minutes

How it use
After authorization (login or register)
In response you will get an http header Authorization. Use it in every request 