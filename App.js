import React from 'react';
import Nav from './src/navigation';
import {Loader} from './src/component';
import {StoreProvider} from './src/context/store';

const App = () => (
  <StoreProvider>
    <Nav />
    <Loader />
  </StoreProvider>
);

export default App;
