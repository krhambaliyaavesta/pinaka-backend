import { SearchUsersUseCase } from "./SearchUsersUseCase";
import { AdminUserRepo } from "../../../domain/repositories/AdminUserRepo";

export class SearchUsersFactory {
  /**
   * Creates a new instance of SearchUsersUseCase with dependencies
   */
  public static create(adminUserRepo: AdminUserRepo): SearchUsersUseCase {
    return new SearchUsersUseCase(adminUserRepo);
  }
}
