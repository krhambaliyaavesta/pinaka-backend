import { KudosCardRepo } from "../../../domain/repositories/KudosCardRepo";
import { TeamRepo } from "../../../domain/repositories/TeamRepo";
import { CategoryRepo } from "../../../domain/repositories/CategoryRepo";
import { UserRepo } from "../../../../auth/domain/repositories/UserRepo";
import { GetKudosCardByIdUseCase } from "./GetKudosCardByIdUseCase";

export class GetKudosCardByIdFactory {
  static create(
    kudosCardRepo: KudosCardRepo,
    teamRepo: TeamRepo,
    categoryRepo: CategoryRepo,
    userRepo: UserRepo
  ): GetKudosCardByIdUseCase {
    return new GetKudosCardByIdUseCase(
      kudosCardRepo,
      teamRepo,
      categoryRepo,
      userRepo
    );
  }
} 