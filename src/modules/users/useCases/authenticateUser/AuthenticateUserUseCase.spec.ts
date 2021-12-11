import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("AuthenticateUser", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate!", async () => {
    const user = await createUserUseCase.execute({
      email: "user@example.com",
      password: "password",
      name: "User",
    });

    const authenticated = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authenticated).toHaveProperty("token");
  });
  it("should not be able to authenticate if email is not valid!", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "user@example.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
  it("should not be able to authenticate if password is not valid!", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        email: "user@example.com",
        password: "123456",
        name: "User",
      });
      await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrongPassword",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
