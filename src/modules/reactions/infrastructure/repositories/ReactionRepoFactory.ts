import { ReactionRepo } from "../../domain/repositories/ReactionRepo";
import { ReactionRepoPgImpl } from "./ReactionRepoPgImpl";
import { DatabaseServiceFactory } from "../../../../shared/services/DatabaseServiceFactory";

export class ReactionRepoFactory {
  public static createReactionRepo(): ReactionRepo {
    const dbService = DatabaseServiceFactory.getDatabase();
    return new ReactionRepoPgImpl(dbService);
  }
}
