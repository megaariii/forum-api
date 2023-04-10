const AddLikeUseCase = require('../../../../Applications/use_case/like/AddLikeUseCase');

class LikeHandler {
  constructor(container) {
    this._container = container;

    this.postLikeHandler = this.postLikeHandler.bind(this);
  }

  async postLikeHandler(request, h) {
    const { threadId, commentId } = request.params;
    const { id: owner } = request.auth.credentials;

    const addLikeUseCase = this._container.getInstance(AddLikeUseCase.name);
    await addLikeUseCase.execute({
      threadId,
      commentId,
      owner,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikeHandler;
