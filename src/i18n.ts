import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        resources: {
            en: {
                translation: {
                    back: "Back",
                    notSet: "Not set",
                    noBluetoothConnection: "You're not connected to your device",
                    clickTo: "Click to",
                    password: "Password",
                    connect: "Connect",
                    connecting: "Connecting",
                    connectTo: "Connect to",
                    connectingTo: "Connecting to",
                    connectedTo: "Connected to",
                    disconnect: "Disconnect",
                    wifi: "Wi-Fi",
                    display: "Display",
                    location: "Location",
                    selectWiFiNetwork: "Choose your Wi-Fi network",
                    connFailed: "Connection failed",
                    otherNetwork: "Інша мережа",
                    currentLocation: "Current location",
                    changeLocation: "Change location",
                }
            },
            uk: {
                translation: {
                    back: "Назад",
                    notSet: "Не встановлено",
                    noBluetoothConnection: "Немає зʼєднання із пристроєм",
                    clickTo: "Натисніть щоб",
                    password: "Пароль",
                    connect: "Підключитись",
                    connectTo: "Підключитись до",
                    connecting: "Підключення",
                    connectingTo: "Підключення до",
                    connectedTo: "Підключено до",
                    disconnect: "Відключитись",
                    wifi: "Wi-Fi",
                    display: "Екран",
                    location: "Локація",
                    selectWiFiNetwork: "Оберіть Wi-Fi мережу",
                    connFailed: "Не вдалося підключитись",
                    otherNetwork: "Інша мережа",
                    currentLocation: "Поточна локація",
                    changeLocation: "Змінити локацію",
                }
            },
            ru: {
                translation: {
                    back: "Назад",
                    notSet: "Не встановлено",
                    noBluetoothConnection: "Немає зʼєднання із пристроєм",
                    clickTo: "Натисніть щоб",
                    password: "Пароль",
                    connect: "Підключитись",
                    connectTo: "Підключитись до",
                    connecting: "Підключення",
                    connectingTo: "Підключення до",
                    connectedTo: "Підключено до",
                    disconnect: "Відключитись",
                    wifi: "Wi-Fi",
                    display: "Екран",
                    location: "Локація",
                    selectWiFiNetwork: "Оберіть Wi-Fi мережу",
                    connFailed: "Не вдалося підключитись",
                    otherNetwork: "Інша мережа",
                    currentLocation: "Поточна локація",
                    changeLocation: "Змінити локацію",
                }
            }
        }
    });

export default i18n;
