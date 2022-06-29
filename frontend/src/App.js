import './App.css';
import { Button } from '@chakra-ui/react'
import { Route } from 'react-router-dom'
import HomePage from '../src/Pages/HomePage'
import ChatPage from '../src/Pages/ChatPage'

function App() {
  return (
    <div className="App">
      <Route path='/' component={HomePage} exact />
      <Route path='/chats' component={ChatPage} />

    </div>
  );
}

export default App;
