import axios from 'axios';

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
    axios.defaults.headers.common['Authorization'] = `Bearer ${userCredentials.token}`;
  }

  public static getUserName(): string {
    return localStorage.getItem('userName');
  }

  public static getUserId(): number {
    return parseInt(localStorage.getItem('userId'));
  }

  public static isLoggedIn(): boolean {
    if (localStorage.getItem('token') !== null) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      return true;
    }
    return false;
  }
}