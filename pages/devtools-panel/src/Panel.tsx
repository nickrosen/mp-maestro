import '@src/Panel.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
// import { persistEventStorage, themeStorage } from '@extension/storage';
import { use, useEffect, useState, type ComponentPropsWithoutRef } from 'react';
import { t } from '@extension/i18n';
import CryptoJS from 'crypto-js';
import type { EventList } from './types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/Accordion';
import { cn } from './util/tailwind';
import { Input } from './components/Input';
import { Check, Settings } from 'lucide-react';
import { Checkbox } from './components/Checkbox';
import { useChromeStorage } from './hooks/useChromeStorage';

const DUMMY_DATA = [
  {
    event: 'view_page',
    properties: {
      $os: 'Mac OS X',
      $browser: 'Chrome',
      $current_url:
        'https://scribehow.com/shared/How_To_Access_Zoom_Scheduler__Metg86RUQVSmfh6xFb713A?referrer=workspace',
      $browser_version: 133,
      $screen_height: 1117,
      $screen_width: 1728,
      mp_lib: 'web',
      $lib_version: '2.51.0',
      $insert_id: '2rbwkgkm0jnlkdfu',
      time: 1740867718.95,
      distinct_id: '$device:19553cd4ea71f7-022ade5affb6c1-1c525636-1d73c0-19553cd4ea71f7',
      $device_id: '19553cd4ea71f7-022ade5affb6c1-1c525636-1d73c0-19553cd4ea71f7',
      $initial_referrer: '$direct',
      $initial_referring_domain: '$direct',
      path: '/shared/[pid]',
      is_electron: false,
      super_organization_id: '709c4f12-d2df-48e8-8e33-90342a6856bf',
      active_organization_id: '8b9eb67f-ca33-4921-8a57-1916c7527532',
      current_plan_atm: 'free',
      current_pro_plan_type_atm: null,
      current_active_team_size: 1,
      token: '52e5e0805583e8a410f1ed50d8e0c049',
      mp_sent_by_lib_version: '2.51.0',
    },
    time: '5/26/2025, 10:03:28 AM',
  },
  {
    event: 'view_experiment',
    properties: {
      $os: 'Mac OS X',
      $browser: 'Chrome',
      $current_url:
        'https://scribehow.com/shared/How_To_Access_Zoom_Scheduler__Metg86RUQVSmfh6xFb713A?referrer=workspace',
      $browser_version: 133,
      $screen_height: 1117,
      $screen_width: 1728,
      mp_lib: 'web',
      $lib_version: '2.51.0',
      $insert_id: '51cs9u8wdkc2cf21',
      time: 1740867719.103,
      distinct_id: '$device:19553cd4ea71f7-022ade5affb6c1-1c525636-1d73c0-19553cd4ea71f7',
      $device_id: '19553cd4ea71f7-022ade5affb6c1-1c525636-1d73c0-19553cd4ea71f7',
      $initial_referrer: '$direct',
      $initial_referring_domain: '$direct',
      experiment: 'doc_insights_completion_CTA',
      variant: 'false',
      is_electron: false,
      super_organization_id: '709c4f12-d2df-48e8-8e33-90342a6856bf',
      active_organization_id: '8b9eb67f-ca33-4921-8a57-1916c7527532',
      current_plan_atm: 'free',
      current_pro_plan_type_atm: null,
      current_active_team_size: 1,
      token: '52e5e0805583e8a410f1ed50d8e0c049',
      mp_sent_by_lib_version: '2.51.0',
    },
    time: '5/26/2025, 10:03:28 AM',
  },
  {
    event: 'view_scribe',
    properties: {
      $os: 'Mac OS X',
      $browser: 'Chrome',
      $current_url:
        'https://scribehow.com/shared/How_To_Access_Zoom_Scheduler__Metg86RUQVSmfh6xFb713A?referrer=workspace',
      $browser_version: 133,
      $screen_height: 1117,
      $screen_width: 1728,
      mp_lib: 'web',
      $lib_version: '2.51.0',
      $insert_id: 'bc31jqu3dpv6vvsq',
      time: 1740867719.108,
      distinct_id: '$device:19553cd4ea71f7-022ade5affb6c1-1c525636-1d73c0-19553cd4ea71f7',
      $device_id: '19553cd4ea71f7-022ade5affb6c1-1c525636-1d73c0-19553cd4ea71f7',
      $initial_referrer: '$direct',
      $initial_referring_domain: '$direct',
      id: '231eb60f3-a454-4154-a67e-1eb115bef5dc',
      viewing_device: 'desktop',
      creator: 'b7600c22-1c4e-4a1e-88a3-b61ecbfd62f6',
      creator_type: 'other',
      doc_super_org_plan: 'enterprise',
      visible_in_gallery: false,
      view_format: 'link-scroll',
      is_electron: false,
      super_organization_id: '709c4f12-d2df-48e8-8e33-90342a6856bf',
      active_organization_id: '8b9eb67f-ca33-4921-8a57-1916c7527532',
      current_plan_atm: 'free',
      current_pro_plan_type_atm: null,
      current_active_team_size: 1,
      token: '52e5e0805583e8a410f1ed50d8e0c049',
      mp_sent_by_lib_version: '2.51.0',
    },
    time: '5/26/2025, 10:03:28 AM',
  },
  {
    event: '$identify',
    properties: {
      $os: 'Mac OS X',
      $browser: 'Chrome',
      $current_url:
        'https://scribehow.com/shared/How_To_Access_Zoom_Scheduler__Metg86RUQVSmfh6xFb713A?referrer=workspace',
      $browser_version: 133,
      $screen_height: 1117,
      $screen_width: 1728,
      mp_lib: 'web',
      $lib_version: '2.51.0',
      $insert_id: '9bu9t1ggaqhp0g1n',
      time: 1740867719.265,
      distinct_id: '85869479-73b4-426d-9925-b0ca24b066f2',
      $device_id: '19553cd4ea71f7-022ade5affb6c1-1c525636-1d73c0-19553cd4ea71f7',
      $initial_referrer: '$direct',
      $initial_referring_domain: '$direct',
      $user_id: '85869479-73b4-426d-9925-b0ca24b066f2',
      $anon_distinct_id: '$device:19553cd4ea71f7-022ade5affb6c1-1c525636-1d73c0-19553cd4ea71f7',
      token: '52e5e0805583e8a410f1ed50d8e0c049',
      mp_sent_by_lib_version: '2.51.0',
    },
    time: '5/26/2025, 10:03:28 AM',
  },
  {
    event: 'view_experiment',
    properties: {
      $os: 'Mac OS X',
      $browser: 'Chrome',
      $current_url:
        'https://scribehow.com/shared/How_To_Access_Zoom_Scheduler__Metg86RUQVSmfh6xFb713A?referrer=workspace',
      $browser_version: 133,
      $screen_height: 1117,
      $screen_width: 1728,
      mp_lib: 'web',
      $lib_version: '2.51.0',
      $insert_id: '1dcbk9xq6243ygik',
      time: 1740867719.386,
      distinct_id: '85869479-73b4-426d-9925-b0ca24b066f2',
      $device_id: '19553cd4ea71f7-022ade5affb6c1-1c525636-1d73c0-19553cd4ea71f7',
      $initial_referrer: '$direct',
      $initial_referring_domain: '$direct',
      $user_id: '85869479-73b4-426d-9925-b0ca24b066f2',
      experiment: 'doc_insights_completion_CTA',
      variant: 'true',
      is_electron: false,
      super_organization_id: '709c4f12-d2df-48e8-8e33-90342a6856bf',
      active_organization_id: '8b9eb67f-ca33-4921-8a57-1916c7527532',
      current_plan_atm: 'free',
      current_pro_plan_type_atm: null,
      current_active_team_size: 1,
      token: '52e5e0805583e8a410f1ed50d8e0c049',
      mp_sent_by_lib_version: '2.51.0',
    },
    time: '5/26/2025, 10:03:28 AM',
  },
  {
    event: 'view_experiment',
    properties: {
      $os: 'Mac OS X',
      $browser: 'Chrome',
      $current_url:
        'https://scribehow.com/shared/How_To_Access_Zoom_Scheduler__Metg86RUQVSmfh6xFb713A?referrer=workspace',
      $browser_version: 133,
      $screen_height: 1117,
      $screen_width: 1728,
      mp_lib: 'web',
      $lib_version: '2.51.0',
      $insert_id: 'klcxfgwzy5jrmccj',
      time: 1740867719.465,
      distinct_id: '85869479-73b4-426d-9925-b0ca24b066f2',
      $device_id: '19553cd4ea71f7-022ade5affb6c1-1c525636-1d73c0-19553cd4ea71f7',
      $initial_referrer: '$direct',
      $initial_referring_domain: '$direct',
      $user_id: '85869479-73b4-426d-9925-b0ca24b066f2',
      experiment: 'docs_1349_intentional_sharing_v2',
      variant: 'copy_link_button',
      is_electron: false,
      super_organization_id: '709c4f12-d2df-48e8-8e33-90342a6856bf',
      active_organization_id: '8b9eb67f-ca33-4921-8a57-1916c7527532',
      current_plan_atm: 'free',
      current_pro_plan_type_atm: null,
      current_active_team_size: 1,
      token: '52e5e0805583e8a410f1ed50d8e0c049',
      mp_sent_by_lib_version: '2.51.0',
    },
    time: '5/26/2025, 10:03:28 AM',
  },
  {
    event: 'view_experiment',
    properties: {
      $os: 'Mac OS X',
      $browser: 'Chrome',
      $current_url:
        'https://scribehow.com/shared/How_To_Access_Zoom_Scheduler__Metg86RUQVSmfh6xFb713A?referrer=workspace',
      $browser_version: 133,
      $screen_height: 1117,
      $screen_width: 1728,
      mp_lib: 'web',
      $lib_version: '2.51.0',
      $insert_id: 'vowtkxdmvfayivmi',
      time: 1740867719.466,
      distinct_id: '85869479-73b4-426d-9925-b0ca24b066f2',
      $device_id: '19553cd4ea71f7-022ade5affb6c1-1c525636-1d73c0-19553cd4ea71f7',
      $initial_referrer: '$direct',
      $initial_referring_domain: '$direct',
      $user_id: '85869479-73b4-426d-9925-b0ca24b066f2',
      experiment: 'docs_1310_unshared_spotlight_scribe_banner',
      variant: 'treatment',
      is_electron: false,
      super_organization_id: '709c4f12-d2df-48e8-8e33-90342a6856bf',
      active_organization_id: '8b9eb67f-ca33-4921-8a57-1916c7527532',
      current_plan_atm: 'free',
      current_pro_plan_type_atm: null,
      current_active_team_size: 1,
      token: '52e5e0805583e8a410f1ed50d8e0c049',
      mp_sent_by_lib_version: '2.51.0',
    },
    time: '5/26/2025, 10:03:28 AM',
  },
  {
    event: 'view_experiment',
    properties: {
      $os: 'Mac OS X',
      $browser: 'Chrome',
      $current_url:
        'https://scribehow.com/shared/How_To_Access_Zoom_Scheduler__Metg86RUQVSmfh6xFb713A?referrer=workspace',
      $browser_version: 133,
      $screen_height: 1117,
      $screen_width: 1728,
      mp_lib: 'web',
      $lib_version: '2.51.0',
      $insert_id: '27sxejmj1nab25dm',
      time: 1740867719.467,
      distinct_id: '85869479-73b4-426d-9925-b0ca24b066f2',
      $device_id: '19553cd4ea71f7-022ade5affb6c1-1c525636-1d73c0-19553cd4ea71f7',
      $initial_referrer: '$direct',
      $initial_referring_domain: '$direct',
      $user_id: '85869479-73b4-426d-9925-b0ca24b066f2',
      experiment: 'docs_1310_unshared_spotlight_scribe_banner',
      variant: 'treatment',
      is_electron: false,
      super_organization_id: '709c4f12-d2df-48e8-8e33-90342a6856bf',
      active_organization_id: '8b9eb67f-ca33-4921-8a57-1916c7527532',
      current_plan_atm: 'free',
      current_pro_plan_type_atm: null,
      current_active_team_size: 1,
      token: '52e5e0805583e8a410f1ed50d8e0c049',
      mp_sent_by_lib_version: '2.51.0',
    },
    time: '5/26/2025, 10:03:28 AM',
  },
  {
    event: 'view_experiment',
    properties: {
      $os: 'Mac OS X',
      $browser: 'Chrome',
      $current_url:
        'https://scribehow.com/shared/How_To_Access_Zoom_Scheduler__Metg86RUQVSmfh6xFb713A?referrer=workspace',
      $browser_version: 133,
      $screen_height: 1117,
      $screen_width: 1728,
      mp_lib: 'web',
      $lib_version: '2.51.0',
      $insert_id: 'hyzquqc5gy38b1y8',
      time: 1740867719.515,
      distinct_id: '85869479-73b4-426d-9925-b0ca24b066f2',
      $device_id: '19553cd4ea71f7-022ade5affb6c1-1c525636-1d73c0-19553cd4ea71f7',
      $initial_referrer: '$direct',
      $initial_referring_domain: '$direct',
      $user_id: '85869479-73b4-426d-9925-b0ca24b066f2',
      experiment: 'scribe_viewer_guide_me_entry_point',
      variant: 'true',
      is_electron: false,
      super_organization_id: '709c4f12-d2df-48e8-8e33-90342a6856bf',
      active_organization_id: '8b9eb67f-ca33-4921-8a57-1916c7527532',
      current_plan_atm: 'free',
      current_pro_plan_type_atm: null,
      current_active_team_size: 1,
      token: '52e5e0805583e8a410f1ed50d8e0c049',
      mp_sent_by_lib_version: '2.51.0',
    },
    time: '5/26/2025, 10:03:28 AM',
  },
];

const MIXPANEL_DOMAIN = 'api.mixpanel.com';

const Panel = () => {
  const [tempEventList, setTempEventList] = useState<EventList>([]);
  // const [eventsPersisted, setEventsPersisted] = useState(false);
  // console.log('*** persistEvents', persistEvents);
  const { storageData, setCustomDomain, setPersistEvents, setEventList, setTheme } = useChromeStorage();
  console.log('*** storageData', storageData);
  const theme = storageData.theme || 'light';
  const isLight = theme === 'light';
  console.log('*** isLight', isLight);
  // const logo = isLight ? 'devtools-panel/logo_horizontal.svg' : 'devtools-panel/logo_horizontal_dark.svg';
  // const goGithubSite = () =>
  //   chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });

  chrome.devtools.network.onRequestFinished.addListener(function (request) {
    if (request.request.url.includes('usage.scribehow.com')) {
      console.log('*** init');

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
    console.log('*** darkModeQuery', darkModeQuery);

    // Set the initial value
    // setIsDarkMode(darkModeQuery.matches);

    // Listen for changes
    darkModeQuery.addEventListener('change', handleChange);

    // Clean up the listener on unmount
    return () => darkModeQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    // `App ${isLight ? 'bg-slate-50 text-gray-900' : 'bg-gray-800 text-gray-100'}`
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
      {/* <header className={`App-header ${isLight ? 'text-gray-900' : 'text-gray-100'}`}> */}
      {/* <button onClick={goGithubSite}>
          <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
        </button> */}
      {/* <p>
          Edit <code>pages/devtools-panel/src/Panel.tsx</code>
        </p> */}
      <ul className="my-4 h-full overflow-y-auto w-full">
        {/* {DUMMY_DATA.map((event, index) => ( */}
        {tempEventList.map((event, index) => (
          <li key={event?.event + '-' + index} className="w-full px-4">
            <div className="border border-slate-400 shadow p-2 rounded my-2 text-left text-sm w-full max-w-full overflow-x-scroll">
              {/* <div id="card-header" className="text-base font-semibold">
                {event.event}
              </div> */}
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  {/* ${event.properties?.experiment ? ': ' + event.properties?.experiment : ''} */}
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
      {/* <ToggleButton onClick={themeStorage.toggle}>{t('toggleTheme')}</ToggleButton> */}
      {/* </header> */}
    </div>
  );
};

// const ToggleButton = (props: ComponentPropsWithoutRef<'button'>) => {
//   const theme = useStorage(themeStorage);
//   return (
//     <button
//       className={
//         props.className +
//         ' ' +
//         'font-bold mt-4 py-1 px-4 rounded shadow hover:scale-105 ' +
//         (theme === 'light' ? 'bg-white text-black' : 'bg-black text-white')
//       }
//       onClick={themeStorage.toggle}>
//       {props.children}
//     </button>
//   );
// };

export default withErrorBoundary(withSuspense(Panel, <div> Loading ... </div>), <div> Error Occur </div>);
