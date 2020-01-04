import axios, {AxiosPromise} from 'axios';


export class CharacterService {

  public static getCharacterTemplates(): AxiosPromise {
    return axios({
      method: 'get',
      url: `${API_URL}api/character_templates/`,
    });
  }

  public static create(templateId: number, name: string): AxiosPromise {
    return axios({
      method: 'post',
      url: `${API_URL}api/characters/`,
      data: {
        templateId: templateId,
        name: name
      }
    });
  }

  public static getAll(): AxiosPromise {
    return axios({
      method: 'get',
      url: `${API_URL}api/characters/`,
    });
  }
}
