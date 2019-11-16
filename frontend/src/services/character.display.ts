
import * as Phaser from 'phaser';
import * as _ from 'lodash';
import {SpriteDefinition} from "../intefaces/sprites";


export class CharacterDisplay {
  public static readonly WIDTH_RATIO: number = 0.72;

  // TODO: this will get populated by a rest call and not just handjammed?
  private static readonly SPRITES: SpriteDefinition[] = [
    {charClass: 'fighter', race: 'human', spriteSheet: 'chara5', animation: {start: 9, end: 11}},
    {charClass: 'rogue', race: 'human', spriteSheet: 'chara2', animation: {start: 48, end: 50}},
    {charClass: 'wizard', race: 'human', spriteSheet: 'chara2', animation: {start: 6, end: 8}},
    {charClass: 'cleric', race: 'human', spriteSheet: 'sample_knights_2x', animation: {start: 3, end: 5}},
    {charClass: 'fighter', race: 'elf', spriteSheet: 'chara2', animation: {start: 0, end: 2}},
    {charClass: 'rogue', race: 'elf', spriteSheet: 'chara5', animation: {start: 48, end: 50}},
    {charClass: 'wizard', race: 'elf', spriteSheet: 'chara3', animation: {start: 9, end: 11}},
    {charClass: 'cleric', race: 'elf', spriteSheet: 'chara5', animation: {start: 51, end: 53}},
    {charClass: 'fighter', race: 'dwarf', spriteSheet: 'chara5', animation: {start: 0, end: 2}},
    {charClass: 'rogue', race: 'dwarf', spriteSheet: 'chara2', animation: {start: 54, end: 56}},
    {charClass: 'wizard', race: 'dwarf', spriteSheet: 'chara2', animation: {start: 9, end: 11}},
    {charClass: 'cleric', race: 'dwarf', spriteSheet: 'chara5', animation: {start: 3, end: 5}},
  ];

  public static getCharacter(scene: Phaser.Scene, race: string, charClass: string): SpriteDefinition {

    return _(this.SPRITES)
      .filter(sprite => sprite.race === race)
      .filter(sprite => sprite.charClass === charClass)
      .first();
  }

  public static getOptionsByLabel(label: string) {
    if (label === 'charClass') {
      return ['Wizard', 'Fighter', 'Rogue', 'Cleric'];
    }
    if (label === 'race') {
      return['Human', 'Elf', 'Dwarf'];
    }
    return ['no options'];
  }
}
