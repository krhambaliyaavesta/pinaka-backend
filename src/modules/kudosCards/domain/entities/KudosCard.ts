/**
 * Represents a kudos card in the system - a digital record of appreciation
 * given by one user to another for a specific achievement or contribution.
 */
export interface KudosCardProps {
  id?: string;
  recipientName: string;
  teamId: number;
  categoryId: number;
  message: string;
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class KudosCard {
  private props: KudosCardProps;

  private constructor(props: KudosCardProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
      deletedAt: props.deletedAt || null,
    };
  }

  public static create(props: KudosCardProps): KudosCard {
    // Validation
    if (!props.recipientName || props.recipientName.trim().length === 0) {
      throw new Error("Recipient name cannot be empty");
    }

    if (props.recipientName.length > 255) {
      throw new Error("Recipient name cannot exceed 255 characters");
    }

    if (!props.message || props.message.trim().length === 0) {
      throw new Error("Kudos message cannot be empty");
    }

    if (!props.createdBy) {
      throw new Error("Creator ID is required");
    }

    return new KudosCard(props);
  }

  // Getters
  public get id(): string | undefined {
    return this.props.id;
  }

  public get recipientName(): string {
    return this.props.recipientName;
  }

  public get teamId(): number {
    return this.props.teamId;
  }

  public get categoryId(): number {
    return this.props.categoryId;
  }

  public get message(): string {
    return this.props.message;
  }

  public get createdBy(): string {
    return this.props.createdBy;
  }

  public get createdAt(): Date {
    return this.props.createdAt as Date;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt as Date;
  }

  public get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  public get isDeleted(): boolean {
    return !!this.props.deletedAt;
  }

  // Methods
  public update(
    props: Partial<
      Omit<KudosCardProps, "id" | "createdAt" | "createdBy" | "deletedAt">
    >
  ): void {
    if (props.recipientName) {
      if (props.recipientName.trim().length === 0) {
        throw new Error("Recipient name cannot be empty");
      }
      if (props.recipientName.length > 255) {
        throw new Error("Recipient name cannot exceed 255 characters");
      }
      this.props.recipientName = props.recipientName;
    }

    if (props.teamId !== undefined) {
      this.props.teamId = props.teamId;
    }

    if (props.categoryId !== undefined) {
      this.props.categoryId = props.categoryId;
    }

    if (props.message) {
      if (props.message.trim().length === 0) {
        throw new Error("Kudos message cannot be empty");
      }
      this.props.message = props.message;
    }

    this.props.updatedAt = new Date();
  }

  public softDelete(): void {
    this.props.deletedAt = new Date();
    this.props.updatedAt = new Date();
  }

  public restore(): void {
    this.props.deletedAt = null;
    this.props.updatedAt = new Date();
  }

  public toObject(): KudosCardProps {
    return {
      ...this.props,
    };
  }
}
