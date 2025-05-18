export enum ReactionType {
  LIKE = "like",
  LOVE = "love",
  CELEBRATE = "celebrate",
  INSIGHTFUL = "insightful",
  CURIOUS = "curious",
}

export interface ReactionProps {
  id: string;
  kudosCardId: string;
  userId: string;
  type: ReactionType;
  createdAt?: Date;
}

export class Reaction {
  private props: ReactionProps;

  private constructor(props: ReactionProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
    };
  }

  public static create(props: ReactionProps): Reaction {
    // Validation
    if (!props.kudosCardId) {
      throw new Error("Kudos Card ID is required");
    }

    if (!props.userId) {
      throw new Error("User ID is required");
    }

    if (!Object.values(ReactionType).includes(props.type)) {
      throw new Error(`Invalid reaction type: ${props.type}`);
    }

    return new Reaction(props);
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

  public get type(): ReactionType {
    return this.props.type;
  }

  public get createdAt(): Date {
    return this.props.createdAt as Date;
  }

  public toObject(): ReactionProps {
    return {
      ...this.props,
    };
  }
}
