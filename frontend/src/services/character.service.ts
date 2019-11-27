import axios, {AxiosPromise} from 'axios';


export class CharacterService {
  private static readonly BASE_URL: string = "http://localhost:8000/";

  public static getCharacterTemplates(): AxiosPromise {
    return axios({
      method: 'get',
      url: `${this.BASE_URL}api/character_templates/`,
    });
  }

  public static create(templateId: number, name: string): AxiosPromise {
    return axios({
      method: 'post',
      url: `${this.BASE_URL}api/characters/`,
      data: {
        templateId: templateId,
        name: name
      }
    });
  }

  public static getAll(): AxiosPromise {
    return axios({
      method: 'get',
      url: `${this.BASE_URL}api/characters/`,
    });
  }
}
