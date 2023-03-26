const AddThreadUseCase = require('../../../../Applications/use_case/thread/AddThreadUseCase');
const AddThread = require('../../../../Domains/threads/entities/AddThread');
const GetThreadDetailsUseCase = require('../../../../Applications/use_case/thread/GetThreadDetailsUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailsHandler = this.getThreadDetailsHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { title, body } = request.payload;
    const { id: owner } = request.auth.credentials;
    const date = new Date().toISOString();
    const addThread = new AddThread({
      title,
      body,
      owner,
      date,
    });

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(addThread);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailsHandler(request, h) {
    const { threadId } = request.params;

    const getThreadDetailsUseCase = this._container.getInstance(
      GetThreadDetailsUseCase.name
    );
    const thread = await getThreadDetailsUseCase.execute(threadId);

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
