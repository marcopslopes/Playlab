import { RouterProvider } from 'react-router';
import { router } from './routes';
import { SettingsProvider } from './contexts/settings-context';
import { ProgressProvider } from './contexts/progress-context';
import { AchievementWatcher } from './components/achievement-watcher';

export default function App() {
  return (
    <SettingsProvider>
      <ProgressProvider>
        <AchievementWatcher>
          <RouterProvider router={router} />
        </AchievementWatcher>
      </ProgressProvider>
    </SettingsProvider>
  );
}