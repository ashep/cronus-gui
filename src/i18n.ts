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
                    connect: "Connect",
                    connecting: "Connecting",
                    wifi: "Wi-Fi",
                    display: "Display",
                    location: "Location",
                    currentLocation: "Current location",
                    changeLocation: "Change location",
                }
            },
            uk: {
                translation: {
                    connect: "Підключитись",
                    connecting: "Підключення",
                    wifi: "Wi-Fi",
                    display: "Екран",
                    location: "Локація",
                    currentLocation: "Поточна локація",
                    changeLocation: "Змінити локацію",
                }
            }
        }
    });

export default i18n;
