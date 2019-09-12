import shortid from 'shortid';
import { BehaviorSubject, Observable } from 'rxjs';
import { useState, useEffect } from 'react';
import log from 'loglevel';

const STORAGE_KEY = 'todolist';

export interface Task {
  id: string;
  description: string;
  completed: boolean;
}

class TaskStore {
  private _tasks: Array<Task> = [];
  public tasks = new BehaviorSubject<Array<Task>>([]);
  public isLoading = new BehaviorSubject<boolean>(false);

  add(description: string): void {
    const newTask = {
      completed: false,
      description,
      id: shortid.generate()
    };

    this._tasks = [...this._tasks, newTask];
    this.broadcastUpdatedTasks();
  }

  clearAllCompleted(): void {
    this._tasks = this._tasks.filter(i => !i.completed);
    this.broadcastUpdatedTasks();
  }

  toggleTaskCompleted(taskId: string): void {
    this._tasks = this._tasks.map(t => {
      if (t.id === taskId) {
        log.debug(`found item to toggle ${taskId}`);
        t.completed = !t.completed;
      }
      return t;
    });
    this.broadcastUpdatedTasks();
  }

  private broadcastUpdatedTasks(): void {
    console.log('Saving taskList to localStorage...');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._tasks));
    this.tasks.next(this._tasks);
  }

  private loadDataAsyncLike(): Promise<string | null> {
    console.log('Loading taskList from localStorage...');
    this.isLoading.next(true);
    const data = localStorage.getItem(STORAGE_KEY);
    const p = new Promise<string | null>(resolve => {
      setTimeout(resolve, 3000, data);
    });
    return p;
  }

  async loadFromLocalStorage(): Promise<void> {
    const data = await this.loadDataAsyncLike();
    if (data) {
      // TODO - make this robust by checking shape of data or catching error and clearing old
      console.log('Loaded taskList');
      this._tasks = JSON.parse(data);
      this.isLoading.next(false);
    } else {
      console.log('No data for taskList found in localStorage.  Init with defaults');
      this._tasks = [];
      this.isLoading.next(false);
    }
    this.tasks.next(this._tasks);
  }
}

export function useObservable<T>(observable: Observable<T>, initialValue: T): T {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const subscription = observable.subscribe(newValue => {
      setValue(newValue);
    });
    return () => subscription.unsubscribe();
  }, [observable]);

  return value;
}

export const taskStore = new TaskStore();
