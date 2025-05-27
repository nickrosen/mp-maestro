import '@src/Popup.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';

const Popup = () => {
  return (
    <div className="px-4 py-3">
      <p className="text-sm mb-3 font-semibold">
        Open devtools and navigate to Mixpanel Events panel to see realtime events
      </p>
      <p className="text-sm mb-3">
        To open devtools in MacOS press
        <br /> Cmd + Opt + I
      </p>
      <p className="text-sm mb-3">
        To open devtools in Windows press
        <br /> Ctrl + Shift + I
      </p>
      <p className="text-sm mb-3">
        or Right-click → Inspect
        <br /> (works on any OS)
      </p>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
