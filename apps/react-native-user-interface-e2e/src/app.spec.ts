import { device, element, by, expect, waitFor } from 'detox';

// On a phone the time picker card starts below the fold.
const scrollTo = async (testID: string) => {
  await waitFor(element(by.id(testID))).toBeVisible().whileElement(by.id('showcase')).scroll(200, 'down');
};

describe('ReactNativeUserInterface', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display the showcase with a card for each picker', async () => {
    await expect(element(by.text('Component showcase'))).toBeVisible();
    await expect(element(by.id('summary-text'))).toBeVisible();
    await scrollTo('date-button');
    await scrollTo('time-button');
  });

  it('should change the time step option', async () => {
    await scrollTo('time-animation');
    await element(by.id('time-step-15')).tap();
    await element(by.id('time-button')).tap();
    await expect(element(by.text('Select a Time'))).toBeVisible();
    await element(by.text('Cancel')).tap();
  });

  it('should open and cancel the date picker', async () => {
    await scrollTo('date-button');
    await element(by.id('date-button')).tap();
    await expect(element(by.text('Select a Date'))).toBeVisible();
    await expect(element(by.id('date-picker-calendar'))).toBeVisible();

    await element(by.text('Cancel')).tap();
    await expect(element(by.text('Select a Date'))).not.toBeVisible();
  });

  it('should open the time picker, drag the slider and keep the app running', async () => {
    await scrollTo('time-button');
    await element(by.id('time-button')).tap();
    await expect(element(by.text('Select a Time'))).toBeVisible();

    await element(by.id('time-picker-slider')).swipe('left', 'fast', 0.5);
    await expect(element(by.text('Select a Time'))).toBeVisible();

    await element(by.text('Cancel')).tap();
    await expect(element(by.text('Select a Time'))).not.toBeVisible();
  });
});
