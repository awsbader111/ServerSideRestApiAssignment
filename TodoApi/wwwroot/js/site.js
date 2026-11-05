const uri = 'api/todoitems';
let todos = [];

const addForm = document.getElementById('add-form');
const editForm = document.getElementById('edit-form');
const editDialog = document.getElementById('edit-dialog');
const messageBox = document.getElementById('message');

document.getElementById('search').addEventListener('input', renderItems);
document.getElementById('filter').addEventListener('change', renderItems);
document.getElementById('close-edit').addEventListener('click', closeInput);
document.getElementById('cancel-edit').addEventListener('click', closeInput);

addForm.addEventListener('submit', async event => {
    event.preventDefault();
    const nameInput = document.getElementById('add-name');
    const name = nameInput.value.trim();

    if (!name) {
        showMessage('Enter a task name before adding it.', true);
        nameInput.focus();
        return;
    }

    try {
        const response = await fetch(uri, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ isComplete: false, name: name })
        });
        if (!response.ok) throw new Error(await responseMessage(response));
        nameInput.value = '';
        showMessage('Task added.', false);
        await getItems();
    } catch (error) {
        showMessage(error.message || 'Unable to add the task. Check that the API is running.', true);
    }
});

editForm.addEventListener('submit', async event => {
    event.preventDefault();
    const id = document.getElementById('edit-id').value;
    const item = {
        id: Number(id),
        isComplete: document.getElementById('edit-isComplete').checked,
        name: document.getElementById('edit-name').value.trim()
    };

    if (!item.name) {
        showMessage('A task name cannot be empty.', true);
        return;
    }

    try {
        const response = await fetch(uri + '/' + id, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });
        if (!response.ok) throw new Error(await responseMessage(response));
        closeInput();
        showMessage('Task updated.', false);
        await getItems();
    } catch (error) {
        showMessage(error.message || 'Unable to update the task.', true);
    }
});

async function getItems() {
    try {
        const response = await fetch(uri, { headers: { 'Accept': 'application/json' } });
        if (!response.ok) throw new Error(await responseMessage(response));
        todos = await response.json();
        renderItems();
    } catch (error) {
        showMessage(error.message || 'Unable to load tasks. Check that the API is running.', true);
        document.getElementById('empty-title').innerText = 'Could not connect to the API';
        document.getElementById('empty-copy').innerText = 'Start the ASP.NET Core project, then refresh this page.';
        document.getElementById('empty-state').hidden = false;
    }
}

async function deleteItem(id) {
    const item = todos.find(todo => todo.id === id);
    if (!item || !window.confirm('Delete "' + item.name + '"?')) return;

    try {
        const response = await fetch(uri + '/' + id, { method: 'DELETE' });
        if (!response.ok) throw new Error(await responseMessage(response));
        showMessage('Task deleted.', false);
        await getItems();
    } catch (error) {
        showMessage(error.message || 'Unable to delete the task.', true);
    }
}

function displayEditForm(id) {
    const item = todos.find(todo => todo.id === id);
    if (!item) return;

    document.getElementById('edit-name').value = item.name || '';
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isComplete').checked = item.isComplete;
    editDialog.showModal();
    document.getElementById('edit-name').focus();
}

function closeInput() {
    editDialog.close();
}

function renderItems() {
    const query = document.getElementById('search').value.trim().toLowerCase();
    const filter = document.getElementById('filter').value;
    const visibleItems = todos.filter(item => {
        const matchesText = (item.name || '').toLowerCase().includes(query);
        const matchesFilter = filter === 'all' ||
            (filter === 'complete' && item.isComplete) ||
            (filter === 'open' && !item.isComplete);
        return matchesText && matchesFilter;
    });

    document.getElementById('total-count').innerText = todos.length;
    document.getElementById('open-count').innerText = todos.filter(item => !item.isComplete).length;
    document.getElementById('completed-count').innerText = todos.filter(item => item.isComplete).length;

    const body = document.getElementById('todos');
    body.replaceChildren();

    visibleItems.forEach(item => {
        const row = body.insertRow();
        if (item.isComplete) row.classList.add('task-complete');

        const statusCell = row.insertCell();
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-check';
        checkbox.checked = item.isComplete;
        checkbox.disabled = true;
        checkbox.setAttribute('aria-label', item.isComplete ? 'Completed' : 'Not completed');
        statusCell.appendChild(checkbox);

        const nameCell = row.insertCell();
        nameCell.className = 'task-name';
        nameCell.textContent = item.name || '';

        const actionsCell = row.insertCell();
        const actions = document.createElement('div');
        actions.className = 'row-actions';

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.className = 'small-button';
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => displayEditForm(item.id));

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.className = 'small-button danger';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteItem(item.id));

        actions.append(editButton, deleteButton);
        actionsCell.appendChild(actions);
    });

    const isEmpty = visibleItems.length === 0;
    document.getElementById('empty-state').hidden = !isEmpty;
    document.querySelector('.table-wrap').hidden = isEmpty;

    if (isEmpty) {
        const hasTasks = todos.length > 0;
        document.getElementById('empty-title').innerText = hasTasks ? 'No matching tasks' : 'Your list is clear';
        document.getElementById('empty-copy').innerText = hasTasks
            ? 'Try another search or choose a different filter.'
            : 'Add your first task above and build some momentum.';
    }
}

function showMessage(text, isError) {
    messageBox.textContent = text;
    messageBox.className = 'message ' + (isError ? 'error' : 'success');
    messageBox.hidden = false;
    window.clearTimeout(showMessage.timer);
    showMessage.timer = window.setTimeout(() => { messageBox.hidden = true; }, 4500);
}

async function responseMessage(response) {
    if (response.status === 404) return 'That task no longer exists. Refreshing the list.';
    if (response.status === 400) return 'The task details were invalid. Check the name and try again.';
    return 'The request failed (' + response.status + '). Please try again.';
}

getItems();
