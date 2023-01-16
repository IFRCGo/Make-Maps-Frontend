import './App.css';
import Header from './components/Header';
import Map from './components/Map';
import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';


function App() {

  return (
    <view>
      <div 
        className="App" 
        style={{
        display: "flex",
        alignSelf: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: 20
      }}>
        <Grid container direction="column" alignItems="center" justify="center">
          <h1>Yo</h1>
          <Stack spacing={2} sx={{ width: 300, padding: 2}}>
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              options={country.map((option) => option.title)}
              renderInput={(params) => <TextField {...params} label="Country" />}
            />
          </Stack>

          <Button variant="contained">Contained</Button>
          {/* <Button variant="outlined">Outlined</Button> */}
        </Grid>
      </div>
    </view>
  );
}

const country = [
  { title: 'Paris', year: 1994 },
  { title: 'London', year: 1972 },
  { title: 'New York', year: 1974 },
  { title: 'Tokyo', year: 2008 },
  { title: 'Berlin', year: 1957 },
  { title: 'Buenos Aires', year: 1993 },
  { title: 'Cairo', year: 1994 },
];

export default App;