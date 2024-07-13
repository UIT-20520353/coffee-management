import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "Welcome to React": "Welcome to React and react-i18next",
      },
      error: {
        error: {
          validate: {
            login: {
              "invalid-credential": "Email hoặc mật khẩu không đúng",
            },
            user: {
              "already-exist": "Email đã tồn tại",
            },
          },
          category: {
            name: {
              "already-exist": "Tên danh mục đã tồn tại",
            },
          },
        },
      },
    },
  },
  lng: "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
