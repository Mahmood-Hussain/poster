import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { useState } from "react";
import "./App.css";
import { storage, db } from "./config/firebase";
import firebase from "firebase";
var mime = require("mime-types");

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

function UploadPost(props) {
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [progress, setProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const uploadPost = (event) => {
    event.preventDefault();

    if (
      !(mime.lookup(file.name).includes("image")) &&
      !(mime.lookup(file.name).includes("video"))
    ) {
        alert('Only images and videos are supported!')
        return false;
    }

    // Show progressbar
    setShowProgressBar(true);
    const uploadTask = storage.ref(`content/${file.name}`).put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress Function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log(progress);
        setProgress(progress);
      },
      (error) => {
        // Error function
        console.log(error);
        alert(error.message);
      },
      () => {
        // Complete function
        storage
          .ref("content")
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              postMediaUrl: url,
              mime: mime.lookup(file.name),
              username: props.username,
            });
            // hide progressbar
            setShowProgressBar(false);
            setProgress(0);
            setCaption("");
            setFile(null);
          });
      }
    );
  };

  return (
    <Card style={{ marginBottom: 20 }}>
      <CardContent>
        <h2 style={{ padding: "20px 0px" }}>Create New Post</h2>
        <form autoComplete="off">
          <Grid container spacing={3}>
            <Grid item md={12}>
              <TextField
                type="file"
                variant="outlined"
                fullWidth={true}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={12}>
              <TextField
                type="text"
                label="Caption"
                variant="outlined"
                fullWidth={true}
                value={caption}
                onChange={(event) => {
                  setCaption(event.target.value);
                }}
              />
            </Grid>
            <Grid item md={12}>
              <div style={{ width: "100%", display:  showProgressBar ? 'block' : 'none'}}>
                <LinearProgressWithLabel value={progress} />
              </div>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <CardActions>
        <Grid item md={12}>
          <Button variant="contained" color="primary" onClick={uploadPost}>
            Upload
          </Button>
        </Grid>
      </CardActions>
    </Card>
  );
}

export default UploadPost;
