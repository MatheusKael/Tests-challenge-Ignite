import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";
import { AppError } from "../../../../shared/errors/AppError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("AuthenticateUser", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a user!", async () => {
    const user = await createUserUseCase.execute({
      email: "test@gmail.com",
      name: "test",
      password: "password",
    });

    expect(user).toHaveProperty("id");
  });
  it("should not be able to create a user if user already exists!", async () => {
    const userExists = await inMemoryUsersRepository.create({
      email: "test@gmail.com",
      name: "test",
      password: "password",
    });

    expect(async () => {
      await createUserUseCase.execute({
        email: userExists.email,
        name: "test",
        password: "password",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
