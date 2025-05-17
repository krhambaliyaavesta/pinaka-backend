import { KudosCardRepo } from "../../../domain/repositories/KudosCardRepo";
import { TeamRepo } from "../../../domain/repositories/TeamRepo";
import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";
import { UserRepo } from "../../../../auth/domain/repositories/UserRepo";
import { CreateKudosCardUseCase } from "./CreateKudosCardUseCase";

export class CreateKudosCardFactory {
  static create(
    kudosCardRepo: KudosCardRepo,
    teamRepo: TeamRepo,
    categoryRepo: CategoryRepo,
    userRepo: UserRepo
  ): CreateKudosCardUseCase {
    return new CreateKudosCardUseCase(
      kudosCardRepo,
      teamRepo,
      categoryRepo,
      userRepo
    );
  }
} 