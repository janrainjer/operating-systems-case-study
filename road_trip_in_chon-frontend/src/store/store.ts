import { configureStore,combineReducers,getDefaultMiddleware } from "@reduxjs/toolkit"
import blogReducer from "./slice/blogSlice"
import userReducer from "./slice/userSlice"
import { persistReducer, persistStore } from "redux-persist";
import storage from "./storage";

const persistConfig = {
    key: 'soft-dev',
    storage,
  }

  const rootReducer = combineReducers({ 
    blog : blogReducer,
    user : userReducer
  })

  const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer : persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }
  ),
})

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch