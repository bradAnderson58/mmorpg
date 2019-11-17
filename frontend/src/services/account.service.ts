import axios, {AxiosPromise} from 'axios';

export class AccountService {
  private static readonly BASE_URL: string = "http://localhost:8000/";


  public static create(username: string, password: string): AxiosPromise {
    return axios({
      method: 'post',
      url: `${this.BASE_URL}api/signup/`,
      data: {
        username: username,
        password: password
      }
    });
  }

  public static login(username: string, password: string): AxiosPromise {
    return axios({
      method: 'post',
      url: `${this.BASE_URL}auth/login/`,
      data: {
        username: username,
        password: password
      }
    });
  }
}