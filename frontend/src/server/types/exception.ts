export enum SecurityExceptionRecoveryAction {
  REGISTER_OR_LOGIN = "REGISTER_OR_LOGIN",
  BECOME_HOST = "BECOME_HOST",
  CONTACT_SUPPORT = "CONTACT_SUPPORT",
  NO_ACTION = "NO_ACTION",
}

export interface PermissionExceptionData {
  action?: SecurityExceptionRecoveryAction;
}

export class SecurityException extends Error {
  private readonly data?: PermissionExceptionData;

  constructor(message: string, data?: PermissionExceptionData, error?: Error) {
    super(message);
    this.data = data;
  }

  getData(): PermissionExceptionData {
    if (this.data) {
      return this.data;
    }
    return { action: SecurityExceptionRecoveryAction.NO_ACTION };
  }
}
