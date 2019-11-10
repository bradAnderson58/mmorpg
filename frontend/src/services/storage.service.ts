
interface UserCredentials {
  userId: number;
  userName: string;
  token: string;
}

export class StorageService {

  public static storeUserAndToken(userCredentials: UserCredentials): void {
    localStorage.setItem('userId', userCredentials.userId.toString());
    localStorage.setItem('userName', userCredentials.userName);
    localStorage.setItem('token', userCredentials.token);
  }

  public static getUserName(): string {
    return localStorage.getItem('userName');
  }
}