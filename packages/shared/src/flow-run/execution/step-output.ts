export enum StepOutputStatus {
  RUNNING = "RUNNING",
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
}

export class StepOutput{
  duration?: number;
  input?: unknown;
  output?: any;
  errorMessage?: unknown;
  status?: StepOutputStatus;
}

export class LoopOnItemsStepOutput extends StepOutput {
  override output:
    | {
        current_item: any;
        current_iteration: number;
        iterations: Record<string, StepOutput>[];
      };
}
