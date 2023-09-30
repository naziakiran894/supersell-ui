// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import appSlice from "./services";
// ** Reducers

import AuthSlice from "./slices/authSlice";

import getUserRoleSlice from "./slices/userRolesSlice";
import timeZonesSlice from "./slices/timeZonesSlice";
import userRoleSlice from "./slices/userRolesSlice";
import companiesSlice from "./slices/companiesSlice";
import currentUserSlice from "./slices/currentUserSlice";
import PermissionsSlice from "./slices/PermissionsSlice";
import fieldsSlice from "./slices/fieldsSlice";
import clientSetting from "./slices/ClientSettingSlice";
import leadMeetingSlice from "./slices/leadMeetingSlice";
import editScheduleSlice from "./slices/editScheduleSlice";

const persistUserReducer = persistReducer(
  {
    key: "Authuser",
    storage,
    blacklist: ["loading", "isSuccess", "message", "isError"],
  },
  AuthSlice
);

export const store = configureStore({
  reducer: {
    auth: persistUserReducer,
    currentUser: currentUserSlice,
    timeZones: timeZonesSlice,
    userRoles: userRoleSlice,
    companies: companiesSlice,
    permissions: PermissionsSlice,
    clientSetting: clientSetting,
    fields: fieldsSlice,
    leadMeeting: leadMeetingSlice,
    currentTab: editScheduleSlice,

    [appSlice.reducerPath]: appSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(appSlice.middleware),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
