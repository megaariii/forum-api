class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    await this._replyRepository.checkOwnerOfReply(useCasePayload);
    await this._replyRepository.deleteReply(useCasePayload);
  }
}

module.exports = DeleteReplyUseCase;
