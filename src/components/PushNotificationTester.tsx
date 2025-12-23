import React, { useState, useEffect } from 'react';
import PushNotificationService from '@/services/pushNotificationService';
import { useAuth } from '@/contexts/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/config/firebase';

const PushNotificationTester: React.FC = () => {
  const { currentUser } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const pushService = PushNotificationService.getInstance();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
    console.log(message);
  };

  useEffect(() => {
    const checkSupport = async () => {
      const supported = pushService.isSupported();
      setIsSupported(supported);
      addLog(`Push notifications supported: ${supported}`);


      addLog(`Browser: ${navigator.userAgent.includes('Chrome') ? 'Chrome' :
        navigator.userAgent.includes('Firefox') ? 'Firefox' :
          navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'}`);
      addLog(`HTTPS: ${location.protocol === 'https:'}`);
      addLog(`Service Worker: ${'serviceWorker' in navigator}`);
      addLog(`Push Manager: ${'PushManager' in window}`);
      addLog(`Notification Permission: ${Notification.permission}`);
    };

    checkSupport();
  }, []);

  const testPermission = async () => {
    try {
      addLog('Requesting notification permission...');
      const result = await pushService.requestPermission();
      setToken(result);
      addLog(`Permission result: ${result}`);

      if (result && result !== 'basic-notifications-enabled' && currentUser) {
        await pushService.storeFCMToken(currentUser.uid, result);
        addLog('FCM token stored successfully');
      }
    } catch (error) {
      addLog(`Permission error: ${error}`);
    }
  };

  const testServiceWorker = async () => {
    try {
      addLog('Registering service worker...');
      await pushService.registerServiceWorker();
      addLog('Service worker registered successfully');


      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        addLog(`Service worker state: ${registration.active?.state || 'inactive'}`);
        addLog(`Service worker scope: ${registration.scope}`);
      }
    } catch (error) {
      addLog(`Service worker error: ${error}`);
    }
  };

  const testLocalNotification = () => {
    try {
      addLog('Testing local notification...');

      if (Notification.permission === 'granted') {
        const notification = new Notification('Test Local Notification', {
          body: 'This is a test notification from your PWA',
          icon: '/android/android-launchericon-192-192.png',
          badge: '/android/android-launchericon-96-96.png',
          tag: 'test'
        });

        notification.onclick = () => {
          addLog('Local notification clicked');
          notification.close();
        };

        addLog('Local notification sent');


        if ('vibrate' in navigator) {
          navigator.vibrate([200, 100, 200]);
          addLog('Vibration triggered');
        }
      } else {
        addLog('Notification permission not granted');
      }
    } catch (error) {
      addLog(`Local notification error: ${error}`);
    }
  };

  const testCloudFunction = async () => {
    if (!currentUser) {
      addLog('User not logged in');
      return;
    }

    try {
      addLog('Testing cloud function push...');


      await addDoc(collection(db, 'pushNotifications'), {
        userId: currentUser.uid,
        payload: {
          title: 'Test Background Push',
          body: 'This should work when app is closed (Chrome/Firefox only)',
          icon: '/android/android-launchericon-192-192.png',
          badge: '/android/android-launchericon-96-96.png',
          tag: 'test-background',
          data: {
            type: 'test',
            url: '/notifications'
          },
          badgeCount: 1
        },
        status: 'pending',
        createdAt: new Date(),
        type: 'user_notification'
      });

      addLog('Test push notification queued for cloud function');
      addLog('Close the app and wait 5-10 seconds for background notification');
    } catch (error) {
      addLog(`Cloud function test error: ${error}`);
    }
  };

  const testBadge = async () => {
    try {
      addLog('Testing app badge...');

      if ('setAppBadge' in navigator) {
        await (navigator as any).setAppBadge(5);
        addLog('App badge set to 5');

        setTimeout(async () => {
          await (navigator as any).clearAppBadge();
          addLog('App badge cleared');
        }, 3000);
      } else {
        addLog('App badge API not supported');
      }
    } catch (error) {
      addLog(`Badge test error: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        🔔 Push Notification Tester
      </h2>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">System Status:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>✅ Notifications Supported: {isSupported ? 'Yes' : 'No'}</div>
          <div>🔐 Permission: {Notification.permission}</div>
          <div>🔧 Service Worker: {'serviceWorker' in navigator ? 'Yes' : 'No'}</div>
          <div>📱 Push Manager: {'PushManager' in window ? 'Yes' : 'No'}</div>
          <div>🔒 HTTPS: {location.protocol === 'https:' ? 'Yes' : 'No'}</div>
          <div>👤 User: {currentUser ? 'Logged In' : 'Not Logged In'}</div>
        </div>
        {token && (
          <div className="mt-2">
            <strong>FCM Token:</strong>
            <code className="block mt-1 p-2 bg-white rounded text-xs break-all">
              {token}
            </code>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testPermission}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          1. Test Permission
        </button>

        <button
          onClick={testServiceWorker}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          2. Test Service Worker
        </button>

        <button
          onClick={testLocalNotification}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          3. Test Local Notification
        </button>

        <button
          onClick={testBadge}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          4. Test Badge
        </button>

        <button
          onClick={testCloudFunction}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          disabled={!currentUser}
        >
          5. Test Background Push
        </button>

        <button
          onClick={clearLogs}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Logs
        </button>
      </div>

      <div className="bg-black text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
        <h3 className="text-white mb-2">Console Logs:</h3>
        {logs.length === 0 ? (
          <div className="text-gray-500">No logs yet. Click buttons above to test features.</div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="mb-1">
              {log}
            </div>
          ))
        )}
      </div>

      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold text-yellow-800">Testing Instructions:</h4>
        <ol className="list-decimal list-inside text-sm text-yellow-700 mt-2 space-y-1">
          <li>Run tests 1-4 to verify basic functionality</li>
          <li>For background push test (Chrome/Firefox only): Run test 5, then <strong>close the browser completely</strong></li>
          <li>Wait 5-10 seconds - you should see an OS notification</li>
          <li>If no notification appears, check the debug guide for troubleshooting</li>
          <li>On iOS Safari: Background push will NOT work (browser limitation)</li>
        </ol>
      </div>
    </div>
  );
};

export default PushNotificationTester;