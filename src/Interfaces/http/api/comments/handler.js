const AddCommentUseCase = require('../../../../Applications/use_case/comment/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/comment/DeleteCommentUseCase');
const AddComment = require('../../../../Domains/comments/entities/AddComment');

class CommentHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const { content } = request.payload;
    const { threadId } = request.params;
    const { id: owner } = request.auth.credentials;
    const date = new Date().toISOString();

    const addComment = new AddComment({
      threadId,
      content,
      owner,
      date,
    });

    const addCommentUseCase = this._container.getInstance(
      AddCommentUseCase.name
    );
    const addedComment = await addCommentUseCase.execute(addComment);

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );

    await deleteCommentUseCase.execute({
      owner,
      commentId,
      threadId,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = CommentHandler;
