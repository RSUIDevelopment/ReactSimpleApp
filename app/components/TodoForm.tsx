import * as React from 'react';
import log from 'loglevel';
import { useState } from 'react';
import { todoListStore } from '../stores/TodoListStore';
import { appInsights } from '../util/AppInsights';

const TodoForm: React.SFC = () => {
  const [taskText, setTaskText] = useState<string>('');

  const handleClear = (): void => {
    log.debug('handleClear');
    todoListStore.clearAllCompleted();
  };

  const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
    const { value } = event.currentTarget;
    setTaskText(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    log.debug('handleSubmit');
    appInsights.trackEvent({ name: 'AddTodoItem', properties: { itemText: taskText } });
    event.preventDefault();
    if (taskText.trim().length > 0) {
      todoListStore.add(taskText);
      setTaskText('');
    }
  };

  return (
    <form className="form-inline form-row" onSubmit={handleSubmit}>
      <div className="col-md-7 offset-md-1">
        <input
          type="text"
          id="todoTask"
          className="form-control-lg w-100"
          placeholder="Enter a task"
          value={taskText}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-3">
        <button type="submit" className="btn btn-primary m-2" disabled={!taskText}>
          Add
        </button>
        <button type="button" onClick={handleClear} className="btn btn-success m-1">
          Clear Completed
        </button>
      </div>
    </form>
  );
};

export default TodoForm;
