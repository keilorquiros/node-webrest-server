export class TodoEntity {
  constructor(
    public id: number,
    public text: string,
    public isCompleted: boolean,
    public completedAt: Date | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  public static fromObject(object: { [key: string]: any }): TodoEntity {
    const { id, text, isCompleted, completedAt, createdAt, updatedAt } = object;
    if (
      !id ||
      !text ||
      isCompleted === undefined ||
      isCompleted === null ||
      completedAt === undefined ||
      !createdAt ||
      !updatedAt
    ) {
      throw "Missing required properties for TodoEntity";
    }

    return new TodoEntity(
      id,
      text,
      isCompleted,
      completedAt,
      createdAt,
      updatedAt,
    );
  }
}
