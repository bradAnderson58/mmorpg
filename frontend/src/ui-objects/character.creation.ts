import * as Phaser from "phaser";
import * as _ from 'lodash';
import {MenuInputContainer} from "./menu-input-container";
import {TextButton} from "./text-button";
import {DropdownField} from "./dropdown-field";
import {CharacterService} from "../services/character.service";
import {SpriteDefinition} from "../intefaces/sprites";
import {InputField} from "./input-field";
import {StorageService} from "../services/storage.service";
import {MessageService} from "../services/message.service";


export class CharacterCreation extends Phaser.GameObjects.Container {
  private menuInput: MenuInputContainer;
  private ANIMATIONS;
  private viewState;

  constructor(scene: Phaser.Scene, x: number, y: number, ret: () => void) {
    const farx = x + (x * 0.35);
    super(scene, farx, y);
    this.ANIMATIONS = {};
    this.viewState = {
      race: 'human',
      charClass: 'wizard'
    };

    const nameLabel = new Phaser.GameObjects.Text(scene, -125, -140, 'Name:', {fontFamily: 'gamefont', color: '#9fb364'});
    const classLabel = new Phaser.GameObjects.Text(scene, -150, -55, 'Class:', {fontFamily: 'gamefont', color: '#9fb364'});
    const raceLabel = new Phaser.GameObjects.Text(scene, 60, -55, 'Race:', {fontFamily: 'gamefont', color: '#9fb364'});
    this.menuInput = new MenuInputContainer(
      scene,
      x - (x * 0.34),
      y,
      'Create Character',
      new TextButton(scene, 0, 75, 'Create', () => this.sendCharacterCreate()),
      () => this.disableCharacterCreate(),
      nameLabel,
      new InputField(scene, 0, -100, 'name-input'),
      classLabel,
      new DropdownField(scene, -150, -30, 'charClass', (label: string, value: string) => this.switchSprite(label, value)),
      raceLabel,
      new DropdownField(scene, 60, -30, 'race', (label: string, value: string) => this.switchSprite(label, value)),
      new TextButton(scene, 0, 150, 'Back', ret),
    );

    this.add([
      this.createBackdrop(),
      this.createSprite(this.viewState.race, this.viewState.charClass),
    ]);

    scene.add.existing(this);
  }

  public destroy(): void {
    this.menuInput.destroy();
    super.destroy();
  }

  private createBackdrop(): Phaser.GameObjects.Rectangle {
    return this.scene.add.rectangle(0, 0, 500, 500, 0x000000);
  }

  private createSprite(race: string, charClass: string): Phaser.GameObjects.Sprite {
    const spriteDef = CharacterService.getCharacter(this.scene, race, charClass);
    console.log(spriteDef);
    const sprite = this.scene.add.sprite(0, 0, spriteDef.spriteSheet)
      .setDisplaySize(200*CharacterService.WIDTH_RATIO, 200);

    sprite.setName('demo-sprite');

    const animationKey = this.getOrCreateSpriteAnimation(spriteDef);
    sprite.anims.load(animationKey);
    sprite.anims.play(animationKey);
    return sprite;
  }

  private switchSprite(label: string, value: string): void {
    this.getByName('demo-sprite').destroy(true);
    this.viewState[label] = value;
    const newSprite = this.createSprite(this.viewState.race, this.viewState.charClass);
    this.add(newSprite);
  }

  private getOrCreateSpriteAnimation(spriteDef: SpriteDefinition): string {
    const key = `${spriteDef.race}_${spriteDef.charClass}`;
    if (!this.ANIMATIONS[key]) {
      this.scene.anims.create({
        key: `${spriteDef.race}_${spriteDef.charClass}`,
        frames: this.scene.anims.generateFrameNumbers(spriteDef.spriteSheet, spriteDef.animation),
        frameRate: 6,
        repeat: -1
      });
      this.ANIMATIONS[key] = key;
    }

    return key;
  }

  private disableCharacterCreate(): boolean {
    const characterName = _.head(document.getElementsByClassName('name-input')).value;

    return !characterName;
  }

  private sendCharacterCreate(): void {
    this.viewState.name = _.head(document.getElementsByClassName('name-input')).value;
    const userId = StorageService.getUserId();

    CharacterService.create(userId, this.viewState)
      .then(response => {
        console.log(response);
        MessageService.showSuccessMessage(`Character ${response} created`);
        this.scene.scene.start('MenuScene');
      }).catch(error => {
        MessageService.showFailureMessage(`Something went wrong: ${error.message}`);
    });
  }
}