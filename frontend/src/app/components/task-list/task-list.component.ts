import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task';
import { TaskService } from '../../services/task.service';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskFormModalComponent],
  template: `
    <div class="task-container">
      <header class="mb-5 text-center">
        <h1 class="display-4">Task Manager</h1>
        <p class="text-muted">Organize and track your tasks efficiently</p>
        <div class="button-container">
          <button class="btn btn-primary mt-4" (click)="showAddModal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
            </svg>
            Add New Task
          </button>
        </div>
      </header>

      <div class="task-list">
        <div *ngIf="tasks.length === 0" class="text-center text-muted p-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
          </svg>
          <p class="mt-3">No tasks available. Add your first task!</p>
        </div>
        
        <div *ngFor="let task of tasks" 
             class="task-item" 
             [class.completed]="task.completed">
          <input 
            type="checkbox" 
            [(ngModel)]="task.completed" 
            (change)="updateTaskStatus(task)"
          />
          <div class="task-content">
            <h4>{{task.title}}</h4>
            <p>{{task.description}}</p>
            <small class="text-muted">Created: {{task.createdAt | date:'MMM d, y, h:mm a'}}</small>
          </div>
          <div class="task-actions">
            <button 
              (click)="showEditModal(task)" 
              class="btn btn-warning"
              title="Edit task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
              </svg>
              Edit
            </button>
            <button 
              (click)="deleteTask(task.id!)" 
              class="btn btn-danger"
              title="Delete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <app-task-form-modal
      *ngIf="showModal"
      [task]="currentTask"
      [isEdit]="!!editingTask"
      (save)="onTaskSave($event)"
      (close)="closeModal()"
    ></app-task-form-modal>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      padding: 2rem 0;
      background-color: var(--background-color);
    }

    header {
      margin-bottom: 3rem !important;
    }

    .button-container {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .task-list {
      opacity: 0;
      animation: fadeIn 0.3s ease-out forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    svg {
      margin-right: 0.5rem;
    }

    .text-center.text-muted.p-5 {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      background: var(--surface-color);
      border-radius: 1rem;
      box-shadow: var(--shadow-sm);
      border: 2px dashed var(--border-color);
    }

    .task-item {
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-10px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  currentTask: Task = { title: '', description: '', completed: false };
  editingTask: Task | null = null;
  showModal = false;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  showAddModal() {
    this.currentTask = { title: '', description: '', completed: false };
    this.editingTask = null;
    this.showModal = true;
  }

  showEditModal(task: Task) {
    this.editingTask = task;
    this.currentTask = { ...task };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingTask = null;
    this.currentTask = { title: '', description: '', completed: false };
  }

  onTaskSave(task: Task) {
    if (this.editingTask) {
      this.taskService.updateTask(this.editingTask.id!, task).subscribe(updatedTask => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.closeModal();
      });
    } else {
      this.taskService.createTask(task).subscribe(newTask => {
        this.tasks = [...this.tasks, newTask];
        this.closeModal();
      });
    }
  }

  updateTaskStatus(task: Task) {
    this.taskService.updateTask(task.id!, task).subscribe();
  }

  deleteTask(id: number) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe(() => {
        this.tasks = this.tasks.filter(task => task.id !== id);
      });
    }
  }
}