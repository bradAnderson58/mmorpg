import BaseSoundManager = Phaser.Sound.BaseSoundManager;
import BaseSound = Phaser.Sound.BaseSound;

export class SceneService {
  private static playingMusic = {};

  public static playMusic(
    soundKey: string,
    sounds: BaseSoundManager,
    loop: boolean = false
  ): BaseSound {

    if (this.playingMusic.hasOwnProperty(soundKey)) {
      return this.playingMusic[soundKey];
    } else {
      const sound = sounds.add(soundKey, {loop: loop});
      this.playingMusic[soundKey] = sound;
      sound.play();
      return sound;
    }
  }

}
