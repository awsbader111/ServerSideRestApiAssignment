# StudyFlow — Student Task Planner API

**Project author:** Aws

StudyFlow is a small student task planner built on the ASP.NET Core controller-based Web API tutorial. It keeps the tutorial's REST endpoints and adds a responsive JavaScript interface for managing study tasks.

## Features

- Create, list, view, update, and delete tasks through the TodoItemsController.
- Filter tasks by status and search by task name in the browser.
- See total, pending, and completed task counts.
- Edit task names and completion status.
- Validate task names and show clear request errors in the interface.
- Serve the JavaScript application from wwwroot.

## Run the application

1. Install the .NET 10 SDK.
2. Open TodoApi.slnx in Visual Studio, or open a terminal in this folder.
3. Run dotnet run.
4. Open the local HTTPS address printed by the application. The task planner is the home page.
5. In Development, the OpenAPI document is available at /openapi/v1.json.

The app uses EF Core's in-memory database, so task data resets when the application stops.

## REST endpoints

| Method | Route | Purpose |
| --- | --- | --- |
| GET | /api/TodoItems | List all tasks |
| GET | /api/TodoItems/{id} | Get one task |
| POST | /api/TodoItems | Create a task |
| PUT | /api/TodoItems/{id} | Update a task |
| DELETE | /api/TodoItems/{id} | Delete a task |

Example request body:

    {
      "name": "Review ASP.NET Core controllers",
      "isComplete": false
    }

The JavaScript client calls the same controller routes shown above, so the browser interface demonstrates the REST API rather than replacing it.
