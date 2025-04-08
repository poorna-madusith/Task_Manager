import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-backdrop" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ isEdit ? 'Edit Task' : 'Add New Task' }}</h3>
          <button class="close-button" (click)="onClose()">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="taskTitle" class="form-label">Title</label>
            <input 
              type="text"
              id="taskTitle"
              class="form-control"
              [(ngModel)]="task.title"
              placeholder="Enter task title"
              required
            />
          </div>
          <div class="form-group">
            <label for="taskDescription" class="form-label">Description</label>
            <textarea 
              id="taskDescription"
              class="form-control"
              [(ngModel)]="task.description"
              placeholder="Enter task description"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="onClose()">Cancel</button>
          <button class="btn btn-primary" (click)="onSave()">
            {{ isEdit ? 'Update' : 'Add' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      font-weight: 500;
      font-size: 0.95rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: all 0.2s ease;
      background-color: var(--surface-color);
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-control.invalid {
      border-color: var(--danger-color);
    }

    .error-message {
      color: var(--danger-color);
      font-size: 0.875rem;
      margin-top: 0.375rem;
      display: block;
    }

    .btn-secondary {
      background-color: var(--text-secondary);
      color: white;
    }

    .btn-secondary:hover {
      background-color: var(--text-primary);
    }
  `]
})
export class TaskFormModalComponent {
  @Input() task: Task = { title: '', description: '', completed: false };
  @Input() isEdit: boolean = false;
  @Output() save = new EventEmitter<Task>();
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onSave() {
    if (this.task.title.trim()) {
      this.save.emit({ ...this.task });
    }
  }
}