import React from 'react'
import './App.css'

import { store } from "./store";
import { StoreContextProvider } from "immer-relite/react";

import { TodoHeader } from "./components/TodoHeader";
import { TodoMain } from "./components/TodoMain";
import { TodoFooter } from "./components/TodoFooter";

function App() {
  return (
    <StoreContextProvider store={store}>
      <TodoHeader />
      <TodoMain />
      <TodoFooter />
    </StoreContextProvider>
  )
}

export default App
