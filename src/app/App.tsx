import { RouterProvider } from 'react-router';
import { router } from './routes';
import { SettingsProvider } from './contexts/settings-context';
import { ProgressProvider } from './contexts/progress-context';
import { VoiceProvider } from './contexts/voice-context';
import { AchievementWatcher } from './components/achievement-watcher';

export default function App() {
  return (
    <SettingsProvider>
      <VoiceProvider>
        <ProgressProvider>
          <AchievementWatcher>
            <RouterProvider router={router} />
          </AchievementWatcher>
        </ProgressProvider>
      </VoiceProvider>
    </SettingsProvider>
  );
}