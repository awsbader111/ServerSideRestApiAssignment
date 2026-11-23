# TodoApi

This project follows the ASP.NET Core controller-based Web API and JavaScript tutorials.

## Run the application

1. Open \`TodoApi.slnx\` in Visual Studio, or open a terminal in this folder.
2. Run the TodoApi project.
3. Open the HTTPS address shown by Visual Studio.

The app uses an in-memory database, so the to-do items reset when the application stops.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /api/TodoItems | Get all to-do items |
| GET | /api/TodoItems/{id} | Get one to-do item |
| POST | /api/TodoItems | Create a to-do item |
| PUT | /api/TodoItems/{id} | Update a to-do item |
| DELETE | /api/TodoItems/{id} | Delete a to-do item |
