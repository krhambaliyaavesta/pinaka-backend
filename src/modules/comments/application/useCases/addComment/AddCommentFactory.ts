import { AddCommentUseCase } from "./AddCommentUseCase";
import { CommentRepo } from "../../../domain/repositories/CommentRepo";
import { KudosCardRepo } from "../../../../kudosCards/domain/repositories/KudosCardRepo";

export class AddCommentFactory {
  static create(commentRepo: CommentRepo, kudosCardRepo: KudosCardRepo) {
    const useCase = new AddCommentUseCase(commentRepo, kudosCardRepo);
    return { useCase };
  }
}
