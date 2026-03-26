import { Link } from 'react-router';
import { ArrowLeft, Moon, Sun, Globe, User, Volume2 } from 'lucide-react';
import { useSettings } from '../contexts/settings-context';
import { useTranslation } from '../hooks/use-translation';
import { useVoice } from '../contexts/voice-context';
import { OutdoorBackground } from './outdoor-background';

export function Settings() {
  const { theme, language, age, setTheme, setLanguage, setAge } = useSettings();
  const { t } = useTranslation();
  const { muted, volume, speed, setMuted, setVolume, setSpeed } = useVoice();

  return (
    <div 
      className="min-h-screen px-6 py-8 relative overflow-hidden"
      style={{ 
        fontFamily: 'var(--font-body)',
        backgroundColor: theme === 'dark' ? '#1F2023' : '#F5F5F0',
        color: theme === 'dark' ? '#E4DCCF' : '#1F2023',
      }}
    >
      <OutdoorBackground />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 mb-8 transition-colors"
          style={{ 
            color: theme === 'dark' ? '#E4DCCF' : '#7C8B95',
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span style={{ fontSize: '0.9375rem' }}>{t('nav.back').toUpperCase()}</span>
        </Link>

        {/* Header */}
        <h1 
          className="mb-8"
          style={{ 
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          {t('settings.title')}
        </h1>

        {/* Settings Cards */}
        <div className="space-y-6">
          
          {/* Theme Setting */}
          <div 
            className="rounded-3xl p-6"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              {theme === 'dark' ? (
                <Moon className="w-6 h-6" style={{ color: '#7D9D9C' }} />
              ) : (
                <Sun className="w-6 h-6" style={{ color: '#FDB022' }} />
              )}
              <h2 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                }}
              >
                {t('settings.theme')}
              </h2>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setTheme('light')}
                className="flex-1 py-3 px-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: theme === 'light' ? '#7D9D9C' : 'rgba(125, 157, 156, 0.2)',
                  color: theme === 'light' ? '#fff' : theme === 'dark' ? '#E4DCCF' : '#1F2023',
                  fontWeight: theme === 'light' ? 600 : 400,
                }}
              >
                {t('settings.light')}
              </button>
              <button
                onClick={() => setTheme('dark')}
                className="flex-1 py-3 px-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: theme === 'dark' ? '#7D9D9C' : 'rgba(125, 157, 156, 0.2)',
                  color: theme === 'dark' ? '#fff' : theme === 'dark' ? '#E4DCCF' : '#1F2023',
                  fontWeight: theme === 'dark' ? 600 : 400,
                }}
              >
                {t('settings.dark')}
              </button>
            </div>
          </div>

          {/* Language Setting */}
          <div 
            className="rounded-3xl p-6"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-6 h-6" style={{ color: '#C08B7E' }} />
              <h2 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                }}
              >
                {t('settings.language')}
              </h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {(['en', 'pt', 'es', 'ca'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className="py-3 px-4 rounded-2xl transition-all"
                  style={{
                    backgroundColor: language === lang ? '#C08B7E' : 'rgba(192, 139, 126, 0.2)',
                    color: language === lang ? '#fff' : theme === 'dark' ? '#E4DCCF' : '#1F2023',
                    fontWeight: language === lang ? 600 : 400,
                  }}
                >
                  {t(`settings.languages.${lang}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Age Setting */}
          <div 
            className="rounded-3xl p-6"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6" style={{ color: '#7C8B95' }} />
              <h2 
                style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                }}
              >
                {t('settings.childAge')}
              </h2>
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {[3, 4, 5, 6, 7, 8, 9].map((ageOption) => (
                <button
                  key={ageOption}
                  onClick={() => setAge(ageOption)}
                  className="aspect-square rounded-2xl transition-all"
                  style={{
                    backgroundColor: age === ageOption ? '#7C8B95' : 'rgba(124, 139, 149, 0.2)',
                    color: age === ageOption ? '#fff' : theme === 'dark' ? '#E4DCCF' : '#1F2023',
                    fontWeight: age === ageOption ? 700 : 400,
                    fontSize: '1.125rem',
                  }}
                >
                  {ageOption}
                </button>
              ))}
            </div>
            
            <p 
              className="mt-4 text-center"
              style={{ 
                fontSize: '0.875rem',
                color: theme === 'dark' ? 'rgba(228, 220, 207, 0.6)' : 'rgba(31, 32, 35, 0.6)',
              }}
            >
              {t('settings.ageLabel', { age })}
            </p>
          </div>

          {/* Voice Setting */}
          <div
            className="rounded-3xl p-6"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.1)' : 'rgba(31, 32, 35, 0.05)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="w-6 h-6" style={{ color: '#7D9D9C' }} />
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                }}
              >
                {t('settings.voice')}
              </h2>
            </div>

            {/* Mute toggle */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setMuted(false)}
                className="flex-1 py-3 px-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: !muted ? '#7D9D9C' : 'rgba(125, 157, 156, 0.2)',
                  color: !muted ? '#fff' : theme === 'dark' ? '#E4DCCF' : '#1F2023',
                  fontWeight: !muted ? 600 : 400,
                }}
              >
                {t('settings.voiceOn')}
              </button>
              <button
                onClick={() => setMuted(true)}
                className="flex-1 py-3 px-4 rounded-2xl transition-all"
                style={{
                  backgroundColor: muted ? '#7D9D9C' : 'rgba(125, 157, 156, 0.2)',
                  color: muted ? '#fff' : theme === 'dark' ? '#E4DCCF' : '#1F2023',
                  fontWeight: muted ? 600 : 400,
                }}
              >
                {t('settings.voiceOff')}
              </button>
            </div>

            {/* Volume */}
            <p
              className="mb-2"
              style={{
                fontSize: '0.875rem',
                color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : 'rgba(31, 32, 35, 0.6)',
              }}
            >
              {t('settings.volume')}
            </p>
            <div className="flex gap-3 mb-4">
              {([0.3, 0.7, 1.0] as const).map((v, i) => {
                const labels = ['settings.volumeQuiet', 'settings.volumeNormal', 'settings.volumeLoud'] as const;
                return (
                  <button
                    key={v}
                    onClick={() => setVolume(v)}
                    className="flex-1 py-3 px-4 rounded-2xl transition-all"
                    style={{
                      backgroundColor: volume === v ? '#C08B7E' : 'rgba(192, 139, 126, 0.2)',
                      color: volume === v ? '#fff' : theme === 'dark' ? '#E4DCCF' : '#1F2023',
                      fontWeight: volume === v ? 600 : 400,
                    }}
                  >
                    {t(labels[i])}
                  </button>
                );
              })}
            </div>

            {/* Speech Speed */}
            <p
              className="mb-2"
              style={{
                fontSize: '0.875rem',
                color: theme === 'dark' ? 'rgba(228, 220, 207, 0.7)' : 'rgba(31, 32, 35, 0.6)',
              }}
            >
              {t('settings.speechSpeed')}
            </p>
            <div className="flex gap-3">
              {([0.7, 0.9, 1.1] as const).map((s, i) => {
                const labels = ['settings.speedSlow', 'settings.speedNormal', 'settings.speedFast'] as const;
                return (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className="flex-1 py-3 px-4 rounded-2xl transition-all"
                    style={{
                      backgroundColor: speed === s ? '#7C8B95' : 'rgba(124, 139, 149, 0.2)',
                      color: speed === s ? '#fff' : theme === 'dark' ? '#E4DCCF' : '#1F2023',
                      fontWeight: speed === s ? 600 : 400,
                    }}
                  >
                    {t(labels[i])}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info */}
          <div
            className="rounded-3xl p-6 text-center"
            style={{
              backgroundColor: theme === 'dark' ? 'rgba(228, 220, 207, 0.05)' : 'rgba(31, 32, 35, 0.03)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <p 
              style={{ 
                fontSize: '0.875rem',
                color: theme === 'dark' ? 'rgba(228, 220, 207, 0.6)' : 'rgba(31, 32, 35, 0.6)',
              }}
            >
              {t('settings.autoSave')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
