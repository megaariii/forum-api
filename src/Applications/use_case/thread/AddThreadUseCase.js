const AddThread = require('../../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute({ title, body, owner, date }) {
    const useCasePayload = new AddThread({
      title,
      body,
      owner,
      date,
    });

    const newThread = new AddThread(useCasePayload);
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = AddThreadUseCase;
