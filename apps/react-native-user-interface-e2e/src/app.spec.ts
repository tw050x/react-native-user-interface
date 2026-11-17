import { device, element, by, expect } from 'detox';

describe('ReactNativeUserInterface', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display the time button and intro text', async () => {
    await expect(element(by.id('time-button'))).toBeVisible();
    await expect(element(by.id('intro'))).toHaveText(
      'Tap on the button above to change the time'
    );
  });
});
