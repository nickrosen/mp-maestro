import '@src/Panel.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import type { EventList } from './types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/Accordion';
import { cn } from './util/tailwind';
import { Input } from './components/Input';
import { Checkbox } from './components/Checkbox';
import { useChromeStorage } from './hooks/useChromeStorage';

const MIXPANEL_DOMAIN = 'api.mixpanel.com';

const Panel = () => {
  const [tempEventList, setTempEventList] = useState<EventList>([]);
  const { storageData, setCustomDomain, setPersistEvents, setEventList, setTheme } = useChromeStorage();

  const theme = storageData.theme || 'light';
  const isLight = theme === 'light';

  chrome.devtools.network.onRequestFinished.addListener(function (request) {
    // 'usage.scribehow.com'
    if (request.request.url.includes(storageData.customDomain || MIXPANEL_DOMAIN)) {
      try {
        // Ensure postData exists
        if (!request.request.postData || !request.request.postData.text) {
          console.log('*** No postData.text found');
          return;
        }

        // 1. Decode URL encoding
        const urlDecodedText = decodeURIComponent(request.request.postData.text);
        console.log('*** URL Decoded:', urlDecodedText);

        // 2. Extract the Base64 part (strip `data=` prefix)
        const base64Match = urlDecodedText.match(/data=([\w+/=]+)/);
        if (!base64Match || !base64Match[1]) {
          console.error('*** No Base64 data found in postData.text');
          return;
        }

        const extractedBase64 = base64Match[1];

        // 3. Ensure Base64 is properly padded
        const fixBase64Padding = (str: string) => {
          return str + '='.repeat((4 - (str.length % 4)) % 4);
        };
        const paddedBase64 = fixBase64Padding(extractedBase64);

        // 4. Decode from Base64 `CryptoJS`
        const textFromBase64 = CryptoJS.enc.Base64.parse(paddedBase64).toString(CryptoJS.enc.Utf8);

        // 5. Parse the decoded JSON string into an array
        let parsedArray: EventList;
        try {
          parsedArray = JSON.parse(textFromBase64);
          console.log('*** Parsed Array:', parsedArray);
        } catch (err) {
          console.error('*** JSON Parsing Error:', err);
          return;
        }

        const now = new Date();
        const dateTimeString = now.toLocaleTimeString();

        // add timest to each event
        parsedArray = parsedArray
          .filter(event => event.event)
          .map(event => ({
            ...event,
            time: dateTimeString,
          }));

        if (storageData.persistEvents) {
          // If persistEvents is true, save the events to storage
          console.log('*** Persisting events to storage');
          const newEventList = [...storageData.eventList, ...parsedArray.map(event => JSON.stringify(event))];
          console.log('*** New Event List:', newEventList);
          setEventList(newEventList);
          setTempEventList(newEventList.map(event => JSON.parse(event)));
          // console.log('*** New Event List:', newEventList);
        } else {
          setTempEventList(parsedArray);
        }
        // Example: Log each item in the array
        // parsedArray.forEach((item, index) => {
        //   console.log(`*** Item ${index + 1}:`, item);
        // });
      } catch (error) {
        console.error('*** Error processing request:', error);
      }
    }
  });

  const handleClearEvents = () => {
    console.log('*** Clear Events');
    setTempEventList([]);
    setEventList([]); // Clear the event list in storage
  };

  useEffect(() => {
    // Load persisted events from storage when the component mounts
    if (storageData.persistEvents) {
      console.log('*** Loading persisted events from storage');
      const persistedEvents = storageData.eventList.map(event => JSON.parse(event));
      setTempEventList(persistedEvents);
    }
  }, [storageData.persistEvents, storageData.eventList]);

  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = e => setTheme(e.matches === true ? 'dark' : 'light');

    // Listen for changes
    darkModeQuery.addEventListener('change', handleChange);

    // Clean up the listener on unmount
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div
      className={cn('App flex flex-col', {
        'bg-slate-50 text-gray-900': isLight,
        'bg-slate-800 text-gray-100': !isLight,
      })}>
      <header
        className={cn('w-full px-4 shadow py-2', {
          'bg-white': isLight,
          'bg-slate-900': !isLight,
        })}>
        <div className="flex gap-2 items-center py-2">
          <div className="flex items-center gap-1.5 flex-1">
            <label htmlFor="custom-url" className="flex-none">
              Custom URL:
            </label>
            <Input
              className="w-full"
              name="custom-url"
              id="custom-url"
              value={storageData.customDomain}
              onChange={e => setCustomDomain(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-1.5">
            <Checkbox checked={storageData.persistEvents} onCheckedChange={value => setPersistEvents(value === true)} />
            <label htmlFor="persist-events">Persist Events</label>
          </div>
          <button onClick={handleClearEvents}>Clear Events</button>
        </div>
      </header>
      <ul className="my-4 h-full overflow-y-auto w-full">
        {/* {DUMMY_DATA.map((event, index) => ( */}
        {tempEventList.map((event, index) => (
          <li key={event?.event + '-' + index} className="w-full px-4">
            <div className="border border-slate-400 shadow p-2 rounded my-2 text-left text-sm w-full max-w-full overflow-x-scroll">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <div className="flex flex-col w-full min-w-0">
                      <div className="flex w-full justify-between text-xs">
                        <span className="truncate min-w-0 font-semibold">{`${event.event}`}</span>
                        <span className="flex-none">{event?.time}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  {event.properties?.experiment && (
                    <div
                      className={cn('text-sm truncate max-w-full min-w-0 pl-4', {
                        'text-slate-600': isLight,
                        'text-slate-300': !isLight,
                      })}>
                      {event.properties?.experiment}
                    </div>
                  )}
                  <AccordionContent>
                    <ul>
                      {/* {console.log()} */}
                      {!!event?.properties &&
                        Object?.entries(event?.properties)?.map(([key, value], index) => (
                          <li
                            key={key + value}
                            className={cn('flex flex-row flex-wrap py-1.5 text-xs', {
                              'border-slate-300': isLight,
                              'border-gray-700': !isLight,
                              'border-b': index !== Object.keys(event.properties).length - 1,
                            })}>
                            <span className="mr-1 opacity-60">{key ?? ''}: </span>
                            <span className="font-medium">{String(value ?? '')}</span>
                          </li>
                        ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Panel, <div> Loading ... </div>), <div> Error Occur </div>);
