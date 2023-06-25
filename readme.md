This is a test assignment

TODO:
1. Register user. 
  Routes:
    POST users/register
      Description:
        User registration
      Receives body: 
        name: string
        password: string
        role: regular || administrator
        if role === regular
          bossId: string
2. Authenticate as user 
  More in middlewares/auth/readme.md
  Routes: 
    POST users/login
      Description:
        User registration
      Receives body: 
        name: string 
        password: string
    DELETE users/logout
      Description: 
        Remove refresh token from cookie
    
3. Return list of users
  Routes:  
    GET users/
    Description:
      If User Role === administrator. Returns all users
      If User Role === regular || boss Returns the user who sent the request, as well as the subordinates and subordinate      subordinates, if any
4. Change user boss
  Routes: 
    POST users/changeBoss/
      Description:
        Changes the user's boss
      Receives body: 
        newBossId: string
        subordinateId: string  

Response Body: {
  More in models/errors/readme.md
  status: "success" | "error" | "unexpectedError",
  body: any,
  message: null | string, (if status: "success" message: always null)
}

Start:
1. Install node.js. 
2. Install mongoDB client or create database in cloud.
3. Install dependencies "npm i"
4. Set config info in config.ts In the file there is an example of a default fill 
5. Run in dev mode "npm run dev" or compile typescript to javascript "npm run build" and start "npm run start"
  When the application is started with "npm run start" The application will always restart if it crashes