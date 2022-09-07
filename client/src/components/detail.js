import React from "react";
import { Stack, Typography } from "@mui/material";

const Detail = ({ info }) => {
  return (
    <Stack key={info._id}>
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
  );
};

export default Detail;
