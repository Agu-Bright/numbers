import React, { useState, useEffect } from "react";
import axios from "axios";
import { getDetails } from "./redux/actions/numDetailActions";
import {
  Stack,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import FileUpload from "./components/fileUpload";

const App = () => {
  const dispatch = useDispatch();
  const { loading, details } = useSelector((state) => state.details);
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState("Choose File");

  const handleClearDatabase = async () => {
    await axios.delete("http://localhost:5000/delete");
  };

  useEffect(() => {
    dispatch(getDetails());
  }, [dispatch]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fisier", file);
    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  return (
    <Stack sx={{ margin: "2px" }}>
      <Stack spacing={2}>
        <Paper
          sx={{
            backgroundColor: "gray",
            display: "flex",
            alignItems: "center",
            justifyContents: "center",
          }}
        >
          <FileUpload submit={onSubmit} onChange={onChange} name={fileName} />
        </Paper>
      </Stack>
      {loading ? (
        <CircularProgress />
      ) : (
        details?.map((info) => (
          <Stack
            key={info._id}
            sx={{ border: "1px solid black", margin: "10px" }}
          >
            <Typography>valid : {info.valid}</Typography>
            <Typography>Number : {info.number}</Typography>
            <Typography>Local Format : {info.local_format}</Typography>
            <Typography>
              International Format : {info.international_format}
            </Typography>
            <Typography>Country Prefix : {info.country_prefix}</Typography>
            <Typography>Country Code : {info.country_code}</Typography>
            <Typography>Country Name : {info.country_name}</Typography>
            <Typography>Country location : {info.location}</Typography>
            <Typography>Carrier : {info.carrier}</Typography>
            <Typography>Line Type : {info.line_type}</Typography>
          </Stack>
        ))
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClearDatabase}
      >
        Clear Database
      </Button>
    </Stack>
  );
};

export default App;
