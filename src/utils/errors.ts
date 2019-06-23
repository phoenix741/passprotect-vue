export interface FunctionalFieldError {
  fieldName?: string | null;
  message?: string | null;
}

export interface FunctionalError {
  errors: Array<FunctionalFieldError>;
}

export class FieldError extends Error {
  fieldName?: string | null = null;
}

export function parseErrors(data: FunctionalError) {
  if (data && data.errors) {
    for (const serverError of data.errors) {
      if (serverError) {
        const error = new FieldError(serverError.message || 'Unknown error');
        error.fieldName = serverError.fieldName;
        throw error;
      }
    }
  }
}
