import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;

describe("GetBalanceUseCase", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should be able to get balance!", async () => {
    const user = await inMemoryUsersRepository.create({
      email: "user@example.com",
      name: "user",
      password: "password",
    });

    const user_id = user.id as string;

    const result = await getBalanceUseCase.execute({
      user_id,
    });

    expect(result).toEqual({ balance: 0, statement: [] });
  });
  it("should not be able to get balance if doesnt exist!", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "naoExiste",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
