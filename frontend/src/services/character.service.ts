import * as _ from 'lodash';
import axios, {AxiosPromise} from 'axios';
import {Character} from "../intefaces/character.interface";


export class CharacterService {
  private static readonly BASE_URL: string = "http://localhost:8000/";

  // TODO: this will get populated by a rest call and not just handjammed?
  private static readonly DEFAULT_CHARACTERS: Character[] = [
    {name: '', charClass: 'fighter', race: 'human', spriteSheet: 'chara5', walkAnimation: {start: 9, end: 11}},
    {name: '', charClass: 'rogue', race: 'human', spriteSheet: 'chara2', walkAnimation: {start: 48, end: 50}},
    {name: '', charClass: 'wizard', race: 'human', spriteSheet: 'chara2', walkAnimation: {start: 6, end: 8}},
    {name: '', charClass: 'cleric', race: 'human', spriteSheet: 'sample_knights_2x', walkAnimation: {start: 3, end: 5}},
    {name: '', charClass: 'fighter', race: 'elf', spriteSheet: 'chara2', walkAnimation: {start: 0, end: 2}},
    {name: '', charClass: 'rogue', race: 'elf', spriteSheet: 'chara5', walkAnimation: {start: 48, end: 50}},
    {name: '', charClass: 'wizard', race: 'elf', spriteSheet: 'chara3', walkAnimation: {start: 9, end: 11}},
    {name: '', charClass: 'cleric', race: 'elf', spriteSheet: 'chara5', walkAnimation: {start: 51, end: 53}},
    {name: '', charClass: 'fighter', race: 'dwarf', spriteSheet: 'chara5', walkAnimation: {start: 0, end: 2}},
    {name: '', charClass: 'rogue', race: 'dwarf', spriteSheet: 'chara2', walkAnimation: {start: 54, end: 56}},
    {name: '', charClass: 'wizard', race: 'dwarf', spriteSheet: 'chara2', walkAnimation: {start: 9, end: 11}},
    {name: '', charClass: 'cleric', race: 'dwarf', spriteSheet: 'chara5', walkAnimation: {start: 3, end: 5}},
  ];

  public static findDefaultCharacter(race: string, charClass: string): Character {
    return _(this.DEFAULT_CHARACTERS)
      .filter(char => char.race === race)
      .filter(char => char.charClass === charClass)
      .first();
  }

  public static create(character: Character): AxiosPromise {
    return axios({
      method: 'post',
      url: `${this.BASE_URL}api/characters/`,
      data: character
    });
  }

  public static getAll(): AxiosPromise {
    return axios({
      method: 'get',
      url: `${this.BASE_URL}api/characters/`,
    });
  }


  public static getOptionsByLabel(label: string): string[] {
    return _(this.DEFAULT_CHARACTERS)
      .uniqBy(label)
      .map(character => character[label].charAt(0).toLocaleUpperCase() + character[label].slice(1));
  }
}
