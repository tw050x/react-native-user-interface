import { render } from '@testing-library/react';

import ReactNativeDatePickerModal from './react-native-date-picker-modal';

describe('ReactNativeDatePickerModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactNativeDatePickerModal />);
    expect(baseElement).toBeTruthy();
  });
});
