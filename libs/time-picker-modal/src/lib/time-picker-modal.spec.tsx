import { render } from '@testing-library/react';

import TimePickerModal from './time-picker-modal';

describe('TimePickerModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TimePickerModal />);
    expect(baseElement).toBeTruthy();
  });
});
