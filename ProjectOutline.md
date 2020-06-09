# Project Outline

Still udpating it. ( just putting points together first)

## Name
Klicker but without a clicker :D :P ( din't want to leave it blank)

> Up to you!

## Problem Statement

The goal of this project is to build an audience response system tool for interactive remote web classrooms. 

> We are specificially aimed at computer science classes and will include the needs specifically for web development classes.

> Why? --> Many ARS and LMS systems are built with web technologies (HTML, CSS, JavaScript) and hence are extremely unfriendly to these from the point of view of working with files of these types for the end user.

The goal of this project is to build an Audience Response System(ARS) that is designed for computer science classes. The ARS and Learning Mangement Systems(LMS) are built with web technologies (HTML, CSS, JavaScript) and hence are extremely unfriendly to these from the point of view of working with files of these types for the end user. This tool will include the needs specifically for web development classes.

## Introduction and Motivation

The tool is an interactive multiuser chat which is suitable for remote web development classes. It allows real-time interaction between the teacher and the students (teacher->student/(s), student->student, student->teacher).The UI will be simple, intuitive and easy to use with fewer interfaces.
As the Computer Science teachers /instructors more often have their work on their own machine , it is an extra effort to upload the questions to the server before hand in order to share it with the students. This tool addresses this problem area and will allow the teacher to instantaneously upload a question or a question block from their machine thereby eliminating the need to duplicate the work.
Teacher and students can exchange the files in these formats :   .txt , .doc , .html , .js, .css .
The feedback or answers that are sent back will be analyzed on the server according to the rules set by the teacher and show the simplified results which can be shared with the class in session. 
The results will be stored in a database on the server.


Currently there is no one customized tool for Computer Science ?literals? (don't know what this means) which is simple and easy to use. Lets understand few of the existing tools to get an overview of why we need for this tool.

> Describe what the tool will allow us to do here. Save the detailed list and comparison of related tools for the next section.

> Also you'll probably indicate here and in more detail in the approach section more specifically what parts you'll be working on as we want to have a base in place for use in Fall 2020 that you can enhance during the fall semester. Do not worry there is a ton to do. Remember that a teacher will want to keep track of student responses... We'll need to keep and eye on the server to track bugs, ...



Blackboard : There is no real time interaction in blackboard. The two way communication (i.e) student-student or teacher-student interaction can be done only by creating threads in Discussion board .This process is messy and also there is no possibility of one-one interaction its always one-many .It needs configuration inorder to get instant notifications for the thread created.( also should i talk about annoucements ?)

> Blackboard is a type of *Learning Management System* there are a number of different ones but they are similar in features/functionality.

> Bring up the issue of file types too.

Zoom : Another tool which has gained immense popularity in the age of Covid-19. This tool allows the real time interaction with the option of Polling where the host/teacher can upload a question with the answers and the students can interact to it by participating in the poll. The problem here is the host have to have all the question blocks updated before hand and the format of interaction is always single /multiple choice
There is no option to add images in the questions,etc. ( need to get more details on this)

> Zoom is a video conferencing app. Mention similar products such as google hangouts and Jitsi...

> Hmm, I don't know about these features since I haven't used it. Can you show images and text?

Klicker : An open source instant audience repsonse system which supports polling .However,the questions/question block should be stored on the server beforehand inorder to share it with the students. There is no option to share directly from the local machine hence this needs duplicating your work on the server. The UI is not simple as it is generic with a lot of interfaces(more on this)

 All these tools don't address the real time classroom scenario's of Computer Science students.They are more generic in their approach and don't give many options to customize the interaction according to the needs of the course. Hence, we propose to address this by building an active learning tool suitable for remote classrooms aimed at the Computer Science spectrum (TA's/teachers).
 
 > What are these? To me they include lots of code samples. And we want them easy to copy (like in the lecture slides), and properly syntax highlighted. We don't want a clunky GUI as the sole input method...  Think about students sharing code too. From a single CSS rule to a whole program...

## Related Work

(what do I write in this? - I kinda already mentioned the other tool part in the intro, maybe I can skip this)

> Most of the previous section goes here. You cannot skip this section. When I review papers for technical magazines/journals I immediately reject papers without an adequate related work section!

## Approach

This tool is a full stack application supporting the client and the server. It is a multiuser interactive chat which will utilize the latest technologies to keep the design,implementation and usage simple .

> Note that we will include multi-user interactive chat enhanced for CS purposes... But the polling and questioning is the prime focus (it requires a bunch more work)

> Start from the networking fundamentals: project will utilized both HTTP and WebSockets where each is most appropriate (describe what to use where)

> System architecture and assumptions

> Security

> Basic technologies


## Implementation

This tool will be implemented using web sockets. Each student who is logged in succesfully creates a new web socket which is closed only on logout.

> Not just websockets, see above comments.

The teacher behaves as an admin and has the control of the session.

Students and teacher can exchange messages via broadcast or individually.(HTML+Markdown)

> Questions and Polls are key here. We will have different types...

Storage on the server will be minimum ,server will be used for information collection and statistics .

> This is part of the architecture/approach...

Security will be provided for the teacher and for the class when in session. Distribuition of the tickets/password to join the session will be done via a semi secure channel to avoid session bombing.

Technology used:

- Front-end languages: HTML, CSS, Javascript 
- Front-end frameworks:  React.js
- Back-end: JavaScript, Node.js
<<<<<<< HEAD
- Back-end frameworks: Express
- Database: MongoDB
- Libraries: express, express-session, ws, bcryptjs,nedb-session-store ,readline-sync
=======
- Back-end *HTTP* framework: Express
- Database: MongoDB 
> or mongoDB like document database such as NeDB

- Libraries: express, express-session, ws, bcryptjs,nedb-session-store 
>>>>>>> 1e4310da3711df0ab4d5bbad3988498e9b3820af
- Test framework :  ? ( I am yet to learn any framework)

> We will need!

> Tooling? NPM, Parcel,

## Schedule

- Week 1: Project planning
- Week 2: Project design and review
- Week 3 – 9: Implementation and unit testing
- Week 10 – 12: Experimentation and unit testing
- Week 13 – 15: Report


## Deliverables

Phase 1/Minimum Viable Product: Multiple choice Questions with HTML and no images(Markdown)

Phase 2 : 

- Questions with HTML and images
- Questions as block messages
- Formatting questions using bundlers ? 

> We have all summer to figure this out...