import { render } from '@testing-library/react';

import DatePickerModal from './date-picker-modal';

describe('DatePickerModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DatePickerModal />);
    expect(baseElement).toBeTruthy();
  });
});
