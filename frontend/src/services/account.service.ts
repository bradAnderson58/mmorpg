import axios, {AxiosPromise} from 'axios';

export class AccountService {
  private static readonly BASE_URL: string = "http://localhost:8000/";
  private static readonly headers = {'content-type': 'application/x-www-form-urlencoded'};


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
}