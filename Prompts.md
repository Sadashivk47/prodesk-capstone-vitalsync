# Prompts.md — AI Architectural Queries

This file documents some of the questions I asked while designing VitalSync's backend architecture.

Most of my previous backend exposure came from internship tasks where I worked around Spring Boot, JPA, repositories, DTOs, and REST APIs. For this project, however, the stack shifted to NestJS and TypeORM. A lot of the terminology looked familiar, but I didn't want to assume that similar names automatically meant identical behavior.

I also used AI tools while vibecoding parts of the UI and wiring frontend flows together, but for backend decisions I mostly used AI as a learning tool: to ask architectural questions, compare concepts across ecosystems, and understand where my assumptions might be wrong before I committed to a database schema or module structure.

The prompts below are less about generating code and more about understanding how the pieces fit together.

---

## 1. Understanding NestJS's architecture

**Prompt:**

> "I've mostly seen backend projects organized into Controllers, Services, and some kind of database layer. NestJS also uses Controllers and Services, but how much of that structure is just naming and how much is enforced by the framework?
>
> How does dependency injection actually work in NestJS modules, and where should business logic live if an operation touches multiple tables—for example, booking an appointment while also checking doctor availability?
>
> I don't want to accidentally put logic in the wrong layer just because the folder names look familiar."

**Why I asked this:**

At first, NestJS looked similar to architectures I had seen before, but I wanted to understand the boundaries between Controllers, Services, and repositories instead of copying patterns blindly. This shaped how I planned features such as scheduling and appointment management.

---

## 2. Understanding TypeORM relationships

**Prompt:**

> "TypeORM uses decorators like `@Entity`, `@OneToMany`, `@ManyToOne`, and `@JoinColumn`, which look very similar to examples I've seen in other ORMs.
>
> Are these relationships loaded automatically, or do developers usually have to request them explicitly? How do eager loading, lazy loading, cascade operations, and problems like N+1 queries actually work in practice?
>
> If I already have appointments connected to doctors and patients, is it better to derive those relationships through joins or duplicate IDs across multiple tables for convenience?"

**Why I asked this:**

I wanted to understand what the ORM was doing behind the scenes before finalizing entity relationships. This influenced how I designed links between appointments, prescriptions, doctors, and patients.

---

## 3. Understanding migrations and schema changes

**Prompt:**

> "As the project grows, tables and relationships will inevitably change. How are TypeORM migrations normally handled in a team setting?
>
> Are migration files supposed to be treated as permanent history, or do developers edit old migrations when requirements change? Also, what's the practical difference between generating migrations and letting the ORM synchronize the database automatically during development?"

**Why I asked this:**

Since medical records are long-lived data, I wanted to understand how schema changes are managed before creating entities. My goal was to avoid relying on automatic database updates without understanding their consequences.

---

## 4. Understanding request flow and authorization

**Prompt:**

> "NestJS has concepts like Guards, DTOs, Pipes, and Interceptors, and they all seem to participate in handling a request.
>
> In what order do these actually run? For example, if a patient tries to access a doctor-only route, does authorization happen before validation or after it?
>
> More generally, what responsibilities belong to Guards versus DTO validation?"

**Why I asked this:**

VitalSync relies heavily on role-based access control because doctors and patients should see different parts of the system. Before implementing authentication, I wanted a clear picture of the request lifecycle.

---

## 5. Understanding JWT authentication

**Prompt:**

> "Because the frontend and backend are deployed separately, I can't rely entirely on traditional server-side sessions.
>
> How does JWT authentication work after login? Where does the token live, and how is it checked on every request?
>
> Also, if there isn't a server-side session anymore, what does 'logout' actually mean? Is deleting the token enough, or do larger systems usually add extra mechanisms?"

**Why I asked this:**

Authentication is one of the most important parts of the project, and I wanted to understand the trade-offs before implementing it. For the MVP, I preferred understanding the simpler approach first instead of adding complexity too early.

---

## How I'm approaching this learning process

This project mixes technologies I have some exposure to with technologies that are completely new to me. While building the UI, I often used AI tools in a vibecoding workflow to iterate quickly and experiment with layouts and user flows.

For backend architecture, though, my approach has been different. Instead of asking AI to build entire modules for me, I've been using it to ask questions about concepts that seem familiar but may behave differently in practice.

A recurring pattern throughout this sprint has been:

* Start from something I partially understand.
* Ask where NestJS and TypeORM behave differently.
* Learn the trade-offs before committing to a design.

The goal isn't to present myself as an expert in either ecosystem. It's to gradually build confidence in the stack, understand the reasoning behind architectural choices, and avoid carrying assumptions into future sprints that could become difficult to undo later.
