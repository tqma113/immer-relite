import React, { useState } from 'react'

import { StorageProvider } from "./global/components";

import { TodoFooter } from "./components/TodoFooter";
import { TodoHeader } from "./components/TodoHeader";
import { TodoMain } from "./components/TodoMain";

import './App.css'

function App() {
  return (
    <StorageProvider>
        <TodoHeader />
        <TodoMain />
        <TodoFooter />
    </StorageProvider>
  )
}

export default App
