import axios, {AxiosPromise} from 'axios';

export class AccountService {


  public static create(username: string, password: string): AxiosPromise {
    return axios({
      method: 'post',
      url: `${API_URL}api/signup/`,
      data: {
        username: username,
        password: password
      }
    });
  }

  public static login(username: string, password: string): AxiosPromise {
    return axios({
      method: 'post',
      url: `${API_URL}auth/login/`,
      data: {
        username: username,
        password: password
      }
    });
  }
}