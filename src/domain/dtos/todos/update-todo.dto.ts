export class UpdateTodoDto {
  private constructor(
    public readonly id: number,
    public readonly text?: string,
    public readonly isCompleted?: boolean,
    public readonly completedAt?: Date | null,
  ) {}

  get values() {
    const returnObj: { [key: string]: any } = {};
    if (this.text !== undefined) returnObj.text = this.text;
    if (this.isCompleted !== undefined) {
      returnObj.isCompleted = this.isCompleted;
      returnObj.completedAt = this.completedAt;
    }
    return returnObj;
  }

  static create(props: { [key: string]: any }): [string?, UpdateTodoDto?] {
    if (!props) return ["Body is required"];
    const { id, previousTodo, text, isCompleted } = props;
    if (isNaN(id)) return ["ID argument is not a number"];

    if (text === undefined && isCompleted === undefined)
      return ["Nothing to update"];

    let completed: boolean | undefined = undefined;
    let completedAt: Date | null | undefined = undefined;

    if (isCompleted !== undefined) {
      if (typeof isCompleted === "boolean") {
        completed = isCompleted;
      } else if (isCompleted === "true" || isCompleted === "false") {
        completed = isCompleted === "true";
      } else {
        return ["isCompleted must be a boolean"];
      }

      if (completed && previousTodo.isCompleted)
        return ["Todo is already completed"];

      completedAt = completed ? new Date() : null;
    }

    return [, new UpdateTodoDto(id, text, completed, completedAt)];
  }
}
