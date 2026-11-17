import { device, element, by, expect } from 'detox';

describe('ReactNativeUserInterface', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display the date and time buttons and intro text', async () => {
    await expect(element(by.id('date-button'))).toBeVisible();
    await expect(element(by.id('time-button'))).toBeVisible();
    await expect(element(by.id('intro'))).toHaveText(
      'Tap on the buttons above to change the date and time'
    );
  });

  it('should open and cancel the date picker', async () => {
    await element(by.id('date-button')).tap();
    await expect(element(by.text('Select a Date'))).toBeVisible();
    await expect(element(by.id('date-picker-calendar'))).toBeVisible();

    await element(by.text('Cancel')).tap();
    await expect(element(by.text('Select a Date'))).not.toBeVisible();
  });

  it('should open the time picker, drag the slider and keep the app running', async () => {
    await element(by.id('time-button')).tap();
    await expect(element(by.text('Select a Time'))).toBeVisible();

    await element(by.id('time-picker-slider')).swipe('left', 'fast', 0.5);
    await expect(element(by.text('Select a Time'))).toBeVisible();

    await element(by.text('Cancel')).tap();
    await expect(element(by.text('Select a Time'))).not.toBeVisible();
  });
});
