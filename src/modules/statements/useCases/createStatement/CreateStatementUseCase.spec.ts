import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";
import { AppError } from "../../../../shared/errors/AppError";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("CreateStatementUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to create a statement!", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@example.com",
      name: "user",
      password: "password",
    });

    const user_id = user.id as string;
    const type = "deposit" as OperationType;

    const result = await createStatementUseCase.execute({
      user_id,
      amount: 100,
      description: "test",
      type,
    });
    const statement_id = result.id as string;

    const statement = await inMemoryStatementsRepository.findStatementOperation(
      { statement_id, user_id }
    );

    expect(result).toEqual(statement);
  });
  it("should not be able to create a statement if user doesnt exist!", async () => {
    expect(async () => {
      const type = "deposit" as OperationType;
      const user_id = "naoExiste";

      const result = await createStatementUseCase.execute({
        user_id,
        amount: 100,
        description: "test",
        type,
      });
      const statement_id = result.id as string;
      await inMemoryStatementsRepository.findStatementOperation({
        statement_id,
        user_id,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
  it("should not be able to create a statement if user has insufficient funds!", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "user@example.com",
        name: "user",
        password: "password",
      });

      const type = "withdraw" as OperationType;
      const user_id = user.id as string;
      await createStatementUseCase.execute({
        user_id,
        amount: 90,
        description: "test",
        type: "deposit" as OperationType,
      });
      const result = await createStatementUseCase.execute({
        user_id,
        amount: 100,
        description: "test",
        type,
      });
      const statement_id = result.id as string;
      await inMemoryStatementsRepository.findStatementOperation({
        statement_id,
        user_id,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
