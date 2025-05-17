/**
 * Represents a team or department in the organization.
 * Teams are used to categorize kudos cards by functional area.
 */
export interface TeamProps {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Team {
  private props: TeamProps;

  private constructor(props: TeamProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public static create(props: TeamProps): Team {
    // Validation
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("Team name cannot be empty");
    }

    if (props.name.length > 100) {
      throw new Error("Team name cannot exceed 100 characters");
    }

    return new Team(props);
  }

  // Getters
  public get id(): number | undefined {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get createdAt(): Date {
    return this.props.createdAt as Date;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt as Date;
  }

  // Setters and methods
  public updateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error("Team name cannot be empty");
    }

    if (name.length > 100) {
      throw new Error("Team name cannot exceed 100 characters");
    }

    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  public toObject(): TeamProps {
    return {
      ...this.props,
    };
  }
}
