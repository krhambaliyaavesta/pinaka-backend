export interface CommentProps {
  id: string;
  kudosCardId: string;
  userId: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Comment {
  private props: CommentProps;

  private constructor(props: CommentProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
      deletedAt: props.deletedAt || null,
    };
  }

  public static create(props: CommentProps): Comment {
    // Validation
    if (!props.kudosCardId) {
      throw new Error("Kudos Card ID is required");
    }

    if (!props.userId) {
      throw new Error("User ID is required");
    }

    if (!props.content || props.content.trim().length === 0) {
      throw new Error("Comment content cannot be empty");
    }

    if (props.content.length > 500) {
      throw new Error("Comment content cannot exceed 500 characters");
    }

    return new Comment(props);
  }

  // Getters
  public get id(): string {
    return this.props.id;
  }

  public get kudosCardId(): string {
    return this.props.kudosCardId;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get content(): string {
    return this.props.content;
  }

  public get createdAt(): Date {
    return this.props.createdAt as Date;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt as Date;
  }

  public get deletedAt(): Date | null {
    return this.props.deletedAt as Date | null;
  }

  public get isDeleted(): boolean {
    return this.props.deletedAt !== null;
  }

  // Methods
  public update(content: string): Comment {
    if (!content || content.trim().length === 0) {
      throw new Error("Comment content cannot be empty");
    }

    if (content.length > 500) {
      throw new Error("Comment content cannot exceed 500 characters");
    }

    this.props.content = content;
    this.props.updatedAt = new Date();

    return this;
  }

  public markAsDeleted(): Comment {
    this.props.deletedAt = new Date();
    return this;
  }

  public toObject(): CommentProps {
    return {
      ...this.props,
    };
  }
}
