import { by, device, element, expect, waitFor } from 'detox';

// Scrolls the current screen until the element is on screen.
const scrollTo = async (screenTestID: string, testID: string) => {
  await waitFor(element(by.id(testID))).toBeVisible().whileElement(by.id(screenTestID)).scroll(200, 'down');
};

describe('ReactNativeUserInterface', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('lists every component on the home screen', async () => {
    await expect(element(by.text('Components'))).toBeVisible();
    await expect(element(by.id('open-date-picker'))).toBeVisible();
    await expect(element(by.id('open-time-picker'))).toBeVisible();
  });

  it('opens a component screen and goes back', async () => {
    await element(by.id('open-date-picker')).tap();
    await expect(element(by.id('date-picker-screen'))).toBeVisible();

    await element(by.id('back')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });

  it('opens and cancels the date picker', async () => {
    await element(by.id('open-date-picker')).tap();
    await element(by.id('date-button')).tap();
    await expect(element(by.text('Select a Date'))).toBeVisible();
    await expect(element(by.id('date-picker-calendar'))).toBeVisible();

    await element(by.text('Cancel')).tap();
    await waitFor(element(by.text('Select a Date'))).not.toBeVisible().withTimeout(3000);
  });

  it('drags the time picker slider with a different timeStep and stylesheet', async () => {
    await element(by.id('open-time-picker')).tap();
    await scrollTo('time-picker-screen', 'time-theme');
    await element(by.id('time-step-15')).tap();
    await element(by.id('time-theme-forest')).tap();

    await element(by.id('time-picker-screen')).scrollTo('top');
    await element(by.id('time-button')).tap();
    await expect(element(by.text('Select a Time'))).toBeVisible();

    await element(by.id('time-picker-slider')).swipe('left', 'fast', 0.5);
    await expect(element(by.text('Select a Time'))).toBeVisible();

    await element(by.text('Cancel')).tap();
    await waitFor(element(by.text('Select a Time'))).not.toBeVisible().withTimeout(3000);
  });
});
