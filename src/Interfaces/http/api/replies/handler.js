const AddReplyUseCase = require('../../../../Applications/use_case/reply/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/reply/DeleteReplyUseCase');
const AddReply = require('../../../../Domains/replies/entities/AddReply');

class ReplyHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const { content } = request.payload;
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;
    const date = new Date().toISOString();

    const addReply = new AddReply({
      threadId,
      commentId,
      content,
      owner,
      date,
    });

    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const addedReply = await addReplyUseCase.execute(addReply);

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }

  async deleteReplyHandler(request, h) {
    const { replyId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    const deleteReplyUseCase = this._container.getInstance(
      DeleteReplyUseCase.name
    );

    await deleteReplyUseCase.execute({
      owner,
      replyId,
      commentId,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ReplyHandler;
