import { useState } from "react";
import EducationList from "./GetEducation";
import AddEducation from "./AddEducation";
import {
  TextField,
  InputAdornment,
  Grid,
  Container,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function App() {
  const [search, setSearch] = useState("");
  const [filteredEducationList, setFilteredEducationList] = useState([]);
  const [searchResult, setSearchResult] = useState(null); // To store the search result
  const [error, setError] = useState(null);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchClick = () => {
    // Clear previous search results and errors
    setSearchResult(null);
    setFilteredEducationList([]);
    setError(null);

    // Send a GET request to the backend endpoint for searching by search criteria
    fetch(`http://localhost:8099/evenements/searchByName?nom=${search}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setSearchResult(data[0]); // Store the first result if found
        } else {
          setSearchResult(null); // No result found
        }
        setFilteredEducationList(data); // Update the list with the response data
      })
      .catch((error) => {
        console.error("Error fetching searched data:", error);
        setError(error.message); // Store the error message
      });
  };

  return (
    <Container>
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search"
            placeholder="Search..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSearchClick}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      <AddEducation />
      {/* Conditionally render the EducationList based on searchResult */}
      {searchResult ? (
        <EducationList educationList={[searchResult]} />
      ) : (
        <EducationList educationList={filteredEducationList} />
      )}
    </Container>
  );
}

export default App;
