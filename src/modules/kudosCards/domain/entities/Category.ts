/**
 * Represents a category of recognition in the Kudos Card system.
 * Categories help classify the types of achievements being recognized.
 */
export interface CategoryProps {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Category {
  private props: CategoryProps;

  private constructor(props: CategoryProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public static create(props: CategoryProps): Category {
    // Validation
    if (!props.name || props.name.trim().length === 0) {
      throw new Error("Category name cannot be empty");
    }

    if (props.name.length > 100) {
      throw new Error("Category name cannot exceed 100 characters");
    }

    return new Category(props);
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
      throw new Error("Category name cannot be empty");
    }

    if (name.length > 100) {
      throw new Error("Category name cannot exceed 100 characters");
    }

    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  public toObject(): CategoryProps {
    return {
      ...this.props,
    };
  }
}
