import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../../entities/Statement";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("GetStatementOperation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to get statement operation!", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@example.com",
      name: "user",
      password: "password",
    });

    const user_id = user.id as string;

    const statement = await inMemoryStatementsRepository.create({
      type: "deposit" as OperationType,
      amount: 100,
      description: "deposit",
      user_id,
    });

    const result = await getStatementOperationUseCase.execute({
      user_id,
      statement_id: statement.id as string,
    });

    const statementExist =
      await inMemoryStatementsRepository.findStatementOperation({
        statement_id: statement.id as string,
        user_id,
      });

    expect(result).toEqual(statementExist);
  });

  it("should not be able to create a statement if user doesnt exist!", async () => {
    expect(async () => {
      const user_id = "naoExiste";
      const statement = await inMemoryStatementsRepository.create({
        type: "deposit" as OperationType,
        amount: 100,
        description: "deposit",
        user_id,
      });

      const result = await getStatementOperationUseCase.execute({
        user_id,
        statement_id: statement.id as string,
      });
      const statement_id = result.id as string;

      await inMemoryStatementsRepository.findStatementOperation({
        statement_id,
        user_id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });
  it("should not be able to create a statement if statement doesnt exist!", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "user@example.com",
        name: "user",
        password: "password",
      });

      const user_id = user.id as string;

      await getStatementOperationUseCase.execute({
        statement_id: "naoExiste",
        user_id,
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
