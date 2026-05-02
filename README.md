# Team Task Manager (Full-Stack Role-Based Application)

A scalable full-stack **team collaboration system** that enables organizations to manage projects, assign tasks, and track progress with role-based access control. This project demonstrates backend architecture design, authentication flow, and relational data modeling using MongoDB.

---

# Project Overview

Team Task Manager is designed to solve real-world team coordination problems:

- Multiple users working on shared projects
- Task assignment with accountability
- Progress tracking in structured workflow (Kanban-like logic)
- Secure authentication and authorization system

It simulates how modern SaaS tools like Jira/Trello backend systems function at a simplified level.

---

# Key Features

## Authentication System
- Secure **user signup & login**
- Password encryption using **bcrypt hashing algorithm**
- JWT-based authentication for stateless session handling
- Prevents unauthorized access to protected routes

---

## Role-Based Access Control (RBAC)
- Two roles implemented:
  - **Admin**
    - Create projects
    - Assign tasks to members
    - Manage team structure
  - **Member**
    - View assigned tasks
    - Update task status

---

## Project Management
- Create multiple projects
- Assign multiple users to a project
- Maintain relationship between users and projects

---

## Task Management System
- Create tasks under a project
- Assign tasks to specific users
- Track task lifecycle:
  - `pending`
  - `in-progress`
  - `done`

---

## Progress Tracking
- Task status updates in real-time (API-based)
- Enables monitoring of project completion

---

# Tech Stack

## Backend
- Node.js (Runtime environment)
- Express.js (REST API framework)
- MongoDB (NoSQL Database)
- Mongoose (ODM for MongoDB)

## Security
- bcrypt.js (Password hashing)
- JSON Web Token (JWT authentication)

---

