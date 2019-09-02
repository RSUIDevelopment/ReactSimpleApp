import * as React from 'react';

import log from 'loglevel';
import { useStore } from '../models/TaskStore';
import { useState } from 'react';
import shortid = require('shortid');

const TodoForm: React.SFC = () => {
  {
    const [taskText, setTaskText] = useState<string>('');
    const store = useStore();

    const handleClear = (): void => {
      //const { onClear } = this.props;
      log.debug('handleClear');
      //onClear();
    };

    const handleChange = (event: React.FormEvent<HTMLInputElement>): void => {
      const { value } = event.currentTarget;
      setTaskText(value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
      log.debug('handleSubmit');
      event.preventDefault();
      if (taskText.trim().length > 0) {
        const taskToAdd: Task = {
          completed: false,
          description: taskText,
          id: shortid.generate()
        };
        store.add(taskToAdd);
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
  }
};

export default TodoForm;
