// Fork from https://github.com/piro0919/use-pwa/blob/master/src/hooks/usePwa/index.ts

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { detect } from 'detect-browser';

type PromiseType<T extends Promise<any>> = T extends Promise<infer P>
  ? P
  : never;

type BeforeInstallPromptEvent = Event & {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
};

export type PwaData = {
  appinstalled: boolean;
  canInstallprompt: boolean;
  enabledA2hs: boolean;
  enabledPwa: boolean;
  enabledUpdate: boolean;
  isLoading: boolean;
  isPwa: boolean;
  showInstallPrompt: () => void;
  unregister: () => Promise<boolean | undefined>;
  userChoice?: PromiseType<BeforeInstallPromptEvent['userChoice']>;
};

export function usePwa(): PwaData {
  const beforeinstallprompt = useRef<BeforeInstallPromptEvent>();
  const [appinstalled, setAppinstalled] = useState(false);
  const [canInstallprompt, setCanInstallprompt] = useState(false);
  const [enabledA2hs, setEnabledA2hs] = useState(false);
  const [enabledPwa, setEnabledPwa] = useState(false);
  const [isPwa, setIsPwa] = useState(false);
  const [enabledUpdate, setEnabledUpdate] = useState(false);
  const [userChoice, setUserChoice] = useState<PwaData['userChoice']>();
  const showInstallPrompt = useCallback(async () => {
    if (!beforeinstallprompt.current) {
      return;
    }

    await beforeinstallprompt.current.prompt();

    if (!beforeinstallprompt.current) {
      return;
    }

    const userChoice = await beforeinstallprompt.current.userChoice;

    setUserChoice(userChoice);
  }, []);
  const unregister = useCallback(async () => {
    if (!('serviceWorker' in window.navigator)) {
      return;
    }

    const registration = await window.navigator.serviceWorker.getRegistration();

    if (!registration) {
      return;
    }

    const result = await registration.unregister();

    return result;
  }, []);
  const handleBeforeInstallPrompt = useCallback(
    (event: BeforeInstallPromptEvent) => {
      beforeinstallprompt.current = event;

      setCanInstallprompt(true);
    },
    []
  );
  const handleAppinstalled = useCallback(() => {
    setAppinstalled(true);
  }, []);
  const [completed, setCompleted] = useState({
    appinstalled: false,
    beforeinstallprompt: false,
    enabledA2hs: false,
    enabledPwa: false,
    enabledUpdate: false,
    isPwa: false,
  });
  const isLoading = useMemo(
    () => !Object.values(completed).filter((value) => value).length,
    [completed]
  );

  useEffect(() => {
    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt as any
    );

    setCompleted((prevCompleted) => ({
      ...prevCompleted,
      beforeinstallprompt: true,
    }));

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt as any
      );
    };
  }, [handleBeforeInstallPrompt]);

  useEffect(() => {
    window.addEventListener('appinstalled', handleAppinstalled);

    setCompleted((prevCompleted) => ({
      ...prevCompleted,
      appinstalled: true,
    }));

    return () => {
      window.removeEventListener('appinstalled', handleAppinstalled);
    };
  }, [handleAppinstalled]);

  useEffect(() => {
    setEnabledPwa(
      'serviceWorker' in window.navigator &&
        'BeforeInstallPromptEvent' in window
    );

    setCompleted((prevCompleted) => ({
      ...prevCompleted,
      enabledPwa: true,
    }));
  }, []);

  useEffect(() => {
    setIsPwa(
      'standalone' in window.navigator ||
        window.matchMedia('(display-mode: standalone)').matches
    );

    setCompleted((prevCompleted) => ({
      ...prevCompleted,
      isPwa: true,
    }));
  }, []);

  useEffect(() => {
    try {
      const browser = detect();

      if (!browser) {
        return;
      }

      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIos =
        userAgent.indexOf('iphone') >= 0 ||
        userAgent.indexOf('ipad') >= 0 ||
        (userAgent.indexOf('macintosh') >= 0 && 'ontouchend' in document);
      const { name } = browser;

      setEnabledA2hs(isIos && name === 'ios');
    } finally {
      setCompleted((prevCompleted) => ({
        ...prevCompleted,
        enabledA2hs: true,
      }));
    }
  }, []);

  useEffect(() => {
    const callback = async () => {
      try {
        if (!('serviceWorker' in window.navigator)) {
          return;
        }

        const registration =
          await window.navigator.serviceWorker.getRegistration();

        if (!registration) {
          return;
        }

        registration.onupdatefound = async () => {
          await registration.update();

          setEnabledUpdate(true);
        };
      } finally {
        setCompleted((prevCompleted) => ({
          ...prevCompleted,
          enabledUpdate: true,
        }));
      }
    };

    callback();
  }, []);

  return {
    appinstalled,
    canInstallprompt,
    enabledA2hs,
    enabledUpdate,
    enabledPwa,
    isLoading,
    isPwa,
    showInstallPrompt,
    unregister,
    userChoice,
  };
}
