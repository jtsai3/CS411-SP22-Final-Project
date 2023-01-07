import React from 'react';
import Container from '@mui/material/Container';
import styles from "./App.module.css";
import Charts from './Charts';
import Header from './Header';

function App() {
  return (
    <Container disableGutters maxWidth={false} className={styles.app}>
      <Header />
      <Charts />
    </Container>
  );
}

export default App;
