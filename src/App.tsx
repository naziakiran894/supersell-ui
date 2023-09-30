import { SettingsConsumer } from "./@core/context/settingsContext";
import { ApiProvider } from "@reduxjs/toolkit/dist/query/react";
import Router from "./Routes/Router";
import appSlice from "./store/services/index";
import { useTranslation } from "react-i18next";
import "react-perfect-scrollbar/dist/css/styles.css";

import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import ThemeComponent from "./@core/theme/ThemeComponent";
import { SnackbarProvider } from "notistack";
import FallbackSpinner from "./@core/components/spinner";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// import {fi} from "date-fns/locale";

import "dayjs/locale/fi";
import "dayjs/locale/en";


import dayjs from "dayjs";

dayjs.Ls.en.weekStart = 1;

import "./configs/i18n";

const App = () => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <ApiProvider api={appSlice}>
        <Provider store={store}>
          <SettingsConsumer>
            {({ settings }) => {
              return (
                <ThemeComponent settings={settings}>
                  <PersistGate
                    loading={<FallbackSpinner />}
                    persistor={persistor}
                  >
                    <DndProvider backend={HTML5Backend}>
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs} adapterLocale={i18n.language==="fn" ? "fi" : "en"}
                        
                      >
                        <SnackbarProvider
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          maxSnack={3}
                        >
                          <Router />
                        </SnackbarProvider>
                      </LocalizationProvider>
                    </DndProvider>
                  </PersistGate>
                </ThemeComponent>
              );
            }}
          </SettingsConsumer>
        </Provider>
      </ApiProvider>
    </>
  );
};

export default App;
