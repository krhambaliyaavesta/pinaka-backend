import { CommentRepo } from "../../domain/repositories/CommentRepo";
import { CommentRepoPgImpl } from "./CommentRepoPgImpl";
import { DatabaseServiceFactory } from "../../../../shared/services/DatabaseServiceFactory";

export class CommentRepoFactory {
  public static createCommentRepo(): CommentRepo {
    const dbService = DatabaseServiceFactory.getDatabase();
    return new CommentRepoPgImpl(dbService);
  }
}
