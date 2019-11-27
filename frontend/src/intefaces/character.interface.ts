

export interface CharacterTemplate {
  id: number;
  race: string;
  characterClass: string;
  spriteSheet: string;
  animations: any;
}

export interface Character {
  id?: number;
  name: string;
  template: CharacterTemplate;
}