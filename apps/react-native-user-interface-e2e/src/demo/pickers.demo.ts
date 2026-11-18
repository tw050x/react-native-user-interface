import { by, device, element } from 'detox';

/*
 * Demos recorded for the library READMEs, not tests. They only run through
 * tools/scripts/record-demos.sh, which records the screen with Detox and turns
 * each video into a GIF. Pauses let the viewer follow each step.
 */

const pause = (ms = 700) => new Promise((resolve) => setTimeout(resolve, ms));

// Each demo relaunches the app in beforeAll, which is not part of the recorded
// video, so every GIF starts on the home screen without a loading screen.
describe('Demos date-picker-modal', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('records', async () => {
    await element(by.id('open-date-picker')).tap();
    await pause(1200);

    await element(by.id('date-button')).tap();
    await pause(1200);

    await element(by.id('date-picker-next-month')).tap();
    await pause();
    await element(by.id('date-picker-next-month')).tap();
    await pause();
    await element(by.id('date-picker-previous-month')).tap();
    await pause();

    // Always unique: padding days from other months are 1–7 or 22 onwards.
    await element(by.text('15')).tap();
    await pause(1000);

    await element(by.id('date-picker-confirm')).tap();
    await pause(2000);
  });
});

describe('Demos time-picker-modal', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  it('records', async () => {
    await element(by.id('open-time-picker')).tap();
    await pause(1200);

    await element(by.id('time-button')).tap();
    await pause(1200);

    await element(by.id('time-picker-slider')).swipe('left', 'slow', 0.6);
    await pause(1000);
    await element(by.id('time-picker-slider')).swipe('right', 'slow', 0.3);
    await pause(1000);

    await element(by.id('time-picker-increment')).tap();
    await pause(500);
    await element(by.id('time-picker-increment')).tap();
    await pause(1000);

    await element(by.id('time-picker-confirm')).tap();
    await pause(2000);
  });
});
