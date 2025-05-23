import { Directive, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

/**
 * Base component for form handling with common form functionality
 */
@Directive()
export abstract class BaseFormComponent implements OnDestroy {
  /**
   * Subject for handling component cleanup on destroy
   */
  protected destroy$ = new Subject<void>();

  /**
   * Abstract form group to be implemented by derived classes
   */
  public abstract form: FormGroup;

  /**
   * Loading state indicator
   */
  public loading = false;

  /**
   * Error message storage
   */
  public error: string | null = null;

  /**
   * Cleans up subscriptions when component is destroyed
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Check if a form control is invalid and touched/dirty
   * @param controlName Name of the form control to check
   * @returns Whether the control is invalid and touched/dirty
   */
  isControlInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  /**
   * Reset form error and loading states
   */
  protected resetState(): void {
    this.loading = false;
    this.error = null;
  }

  /**
   * Set loading state
   */
  protected setLoading(isLoading: boolean): void {
    this.loading = isLoading;
  }

  /**
   * Set error message
   */
  protected setError(errorMessage: string | null): void {
    this.error = errorMessage;
  }
}
