'use client';
import { useState, useRef, useEffect } from 'react';
import { addDays, format } from 'date-fns';
import { DateRangePicker, Range, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import useDirection from '@hooks/useDirection';

interface CustomDateRangePickerProps {
  onChange: (range: { startDate: Date; endDate: Date }) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
}

export default function CustomDateRangePicker({
  onChange,
  initialStartDate = new Date(),
  initialEndDate = addDays(new Date(), 7),
}: CustomDateRangePickerProps) {
  const [state, setState] = useState<Range[]>([
    {
      startDate: initialStartDate,
      endDate: initialEndDate,
      key: 'selection',
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false); // Track if user is selecting end date
  const pickerRef = useRef<HTMLDivElement>(null);
  const [direction] = useDirection();

  const handleSelect = (ranges: RangeKeyDict) => {
    const newRange = ranges.selection as Range;
    setState([newRange]);

    if (newRange.startDate && newRange.endDate) {
      onChange({
        startDate: newRange.startDate,
        endDate: newRange.endDate,
      });


      if (isSelectingEndDate) {
        setIsOpen(false);
        setIsSelectingEndDate(false);
      }
    }


    if (!isSelectingEndDate && newRange.startDate) {
      setIsSelectingEndDate(true);
    }
  };

  const togglePicker = () => setIsOpen(!isOpen);
  const closePicker = () => setIsOpen(false);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        closePicker();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedRange = state[0];
  const formattedRange =
    selectedRange.startDate && selectedRange.endDate
      ? `${format(selectedRange.startDate, 'yyyy-MM-dd')} | ${format(selectedRange.endDate, 'yyyy-MM-dd')}`
      : 'Select Date Range';

  return (
    <div className={`relative w-full`} ref={pickerRef} dir={direction}>
      <button
        type="button"
        onClick={togglePicker}
        className="w-full border border-gray-200 rounded-xl flex items-center px-3 gap-2 py-2 cursor-pointer text-start focus:outline-none hover:border-gray-300 transition-colors"
      >
        <span>

<svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.25666 0.846008C5.40646 0.846008 5.55012 0.905514 5.65604 1.01144C5.76196 1.11736 5.82147 1.26102 5.82147 1.41081V1.98541C6.32 1.97562 6.86899 1.97562 7.47296 1.97562H10.5703C11.1751 1.97562 11.7241 1.97562 12.2226 1.98541V1.41081C12.2226 1.26102 12.2821 1.11736 12.388 1.01144C12.4939 0.905514 12.6376 0.846008 12.7874 0.846008C12.9372 0.846008 13.0809 0.905514 13.1868 1.01144C13.2927 1.11736 13.3522 1.26102 13.3522 1.41081V2.0336C13.548 2.04867 13.7335 2.06774 13.9087 2.09084C14.7913 2.20982 15.506 2.45984 16.07 3.02314C16.6333 3.58719 16.8834 4.30186 17.0023 5.18446C17.1176 6.04297 17.1176 7.13869 17.1176 8.52284V10.1133C17.1176 11.4975 17.1176 12.594 17.0023 13.4517C16.8834 14.3343 16.6333 15.049 16.07 15.613C15.506 16.1763 14.7913 16.4263 13.9087 16.5453C13.0502 16.6605 11.9545 16.6605 10.5703 16.6605H7.47446C6.09032 16.6605 4.99384 16.6605 4.13609 16.5453C3.25349 16.4263 2.53882 16.1763 1.97477 15.613C1.41147 15.049 1.16145 14.3343 1.04247 13.4517C0.927246 12.5932 0.927246 11.4975 0.927246 10.1133V8.52284C0.927246 7.13869 0.927246 6.04221 1.04247 5.18446C1.16145 4.30186 1.41147 3.58719 1.97477 3.02314C2.53882 2.45984 3.25349 2.20982 4.13609 2.09084C4.31181 2.06774 4.49732 2.04867 4.69261 2.0336V1.41081C4.69261 1.26115 4.75202 1.1176 4.85777 1.0117C4.96353 0.905802 5.107 0.846208 5.25666 0.846008ZM4.2852 3.21066C3.52836 3.31232 3.09158 3.5036 2.77303 3.82215C2.45448 4.1407 2.2632 4.57749 2.16153 5.33432C2.14446 5.46235 2.1299 5.59765 2.11785 5.74023H15.9262C15.9142 5.59765 15.8996 5.4621 15.8825 5.33357C15.7809 4.57673 15.5896 4.13995 15.271 3.8214C14.9525 3.50285 14.5157 3.31157 13.7581 3.20991C12.9847 3.10598 11.9643 3.10448 10.5282 3.10448H7.51588C6.07977 3.10448 5.06011 3.10673 4.2852 3.21066ZM2.0561 8.56501C2.0561 7.92189 2.0561 7.36235 2.06589 6.87059H15.9782C15.988 7.36235 15.988 7.92189 15.988 8.56501V10.0712C15.988 11.5073 15.9865 12.5277 15.8825 13.3018C15.7809 14.0587 15.5896 14.4955 15.271 14.814C14.9525 15.1326 14.5157 15.3238 13.7581 15.4255C12.9847 15.5294 11.9643 15.5309 10.5282 15.5309H7.51588C6.07977 15.5309 5.06011 15.5294 4.2852 15.4255C3.52836 15.3238 3.09158 15.1326 2.77303 14.814C2.45448 14.4955 2.2632 14.0587 2.16153 13.3011C2.05761 12.5277 2.0561 11.5073 2.0561 10.0712V8.56501Z" fill="#8C96A5"/>
</svg>

          </span><span>{formattedRange}</span>
      </button>

      {isOpen && (
        <div className={`absolute z-50 mt-2 bg-white rounded-xl shadow-lg w-auto left-0 overflow-hidden`}>
          <DateRangePicker
            onChange={handleSelect}
            ranges={state}
            months={2}
            direction="horizontal"
            showDateDisplay={false}
            showMonthAndYearPickers={true}
            rangeColors={['#1e3a8a']}
            staticRanges={[]}
            inputRanges={[]}
            minDate={new Date()}
          />
        </div>
      )}
    </div>
  );
}