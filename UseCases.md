# Use Cases

- Will use Admin as short for Admin/Teacher when writing more details.

## Admin/Teacher Login

- Setting up admin password.
- Do we let admin login more than once?
 1) Do we by default logout user/admin if they close the app ?
 2) Admin login should be done only once 
 3) user should also have one active sessiona at a time ?
 4) Do we add the functionality to logout of the current session if the user/admin does a concurrent login so that there is only one active sessiona at a time? 
- Logging admin logins (also the user logins?)

## Admin/Teacher Setup classroom session

- Real time setup, no scheduling
- One class at a time for now
- Admin specifies class name (will be used for keeping records along with start time) and a login password.
- Admin distributes password to students via a separate channel: Blackboard, Zoom, etc... 

## Student Login to classroom

- Classroom session must already be established by Admin
- User logs in with name/identifier and classroom password
- We keep track of students so we can send them messages, and know who sent which messages, and also to suppress spam behavior.
 1) Basically when we are authenticating a student we will compare their name from our database along with the course password, right?

## Markdown Message Sending
- Markdown without images communications
- Admin to student, Admin to all students, Admin to groups?
- Students to Admin
- Students to Students (more advanced, may need to moderate)
- Messages are entered and sent in Markdown and rendered into HTML

## Simple Multiple Choice Question/Polling
- Question/Poll Authoring: Structured Markdown (HTML structuring elements containing Markdown)
- Question/Poll Student Display
- Question/Poll Student Response
- Response aggregation for Teacher (What should be done on the server)
- Response display for Teacher

## Images with Questions, Polls, and Messages?

- Best way to combine Markdown/HTML and images in messages?
- Want to keep authoring fairly simple
- Don't want to reinvent a transport protocol on top of WebSockets