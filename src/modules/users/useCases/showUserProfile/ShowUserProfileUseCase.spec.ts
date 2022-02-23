import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { AppError } from "../../../../shared/errors/AppError";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("AuthenticateUser", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should be able to create a user!", async () => {
    const { id: user_id } = await inMemoryUsersRepository.create({
      email: "test@gmail.com",
      name: "test",
      password: "password",
    });
    const profile = await showUserProfileUseCase.execute(user_id);

    expect(profile).toHaveProperty("id", user_id);
  });
  it("should not be able to create a user if user was not found!", async () => {
    const user_id = "doesntExist";

    expect(async () => {
      await showUserProfileUseCase.execute(user_id);
    }).rejects.toBeInstanceOf(AppError);
  });
});
