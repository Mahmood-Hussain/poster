import { Button, Container, Grid } from "@material-ui/core";
import { useState, useEffect } from "react";
import "./App.css";
import Nav from "./Nav";
import Post from "./Post";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import { db, auth } from "./config/firebase";
import UploadPost from "./UploadPost";
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    maxWidth: 512,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [posts, setPosts] = useState([]);
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [openSignInModal, setOpenSignInModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  // USEEFFECT: it runs a piece of code based on a specific condition
  useEffect(() => {
    db.collection("posts").orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      // Every single time some change happens to posts this code runs
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    });
  }, []);
  // if the above array is empty then it is gonna run only once when app loads

  // hanlde modal close (Signup)
  const handleSignUpModalClose = () => {
    setOpenSignUpModal(false);
  };

  // hanlde modal close (Signin)
  const handleSignInModalClose = () => {
    setOpenSignUpModal(false);
  };

  // Handle the signup logic wiht firebase
  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((registeredUser) => {
        setOpenSignUpModal(false);
        return registeredUser.user.updateProfile({
          displayName: username,
        });
        
      })
      .catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        alert("Error Code " + errorCode + " Details: " + errorMessage);
      });
  };

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .then(()=>setOpenSignInModal(false))
    .catch((error)=>alert(error.message))
    
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // yes user is logged in
        setUser(authUser);
      } else {
        // User is not logged in
        setUser(null);
      }
    });

    return () => {
      // perform some cleanup functions
      unsubscribe(); // Detach the listner
    };
  }, [user, username]);

  // Signup Modal body
  const signUpModalBody = (
    <div style={modalStyle} className={classes.paper}>
      <h2 style={{ padding: "20px 0px" }}>Create Account</h2>
      <form className={classes.root} noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item md={12}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth={true}
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              type="email"
              label="Email"
              variant="outlined"
              fullWidth={true}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              fullWidth={true}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Grid>
          {/* <Grid item md={12}>
            <TextField
              type="password"
              label="Repeat Password"
              variant="outlined"
              fullWidth={true}
            />
          </Grid> */}
          <Grid item md={12}>
            <Button variant="contained" color="primary" onClick={signUp}>
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );

  // Signin Modal body
  const signInModalBody = (
    <div style={modalStyle} className={classes.paper}>
      <h2 style={{ padding: "20px 0px" }}>Create Account</h2>
      <form className={classes.root} noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item md={12}>
            <TextField
              type="email"
              label="Email"
              variant="outlined"
              fullWidth={true}
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              fullWidth={true}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Grid>
          <Grid item md={12}>
            <Button variant="contained" color="primary" onClick={signIn}>
              Sign In
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
  return (
    <div className="App">
      <Nav />
      <div className="main">
        {/* Check if user is already logged in then show him only log out button */}
        {user ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => auth.signOut()}
          >
            Sign Out
          </Button>
        ) : (
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenSignInModal(true)}
            >
              Sign In
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenSignUpModal(true)}
            >
              Sign Up
            </Button>
          </div>
        )}
        <Container maxWidth="sm">
          {user?.displayName ? (
            <UploadPost username={user.displayName} />
          ): (
          <h4>Login to upload a post</h4>
          )}
          {posts.map(({ id, post }) => (
            <Post key={id} post={post} />
          ))}
        </Container>
        <Modal
          open={openSignUpModal}
          onClose={handleSignUpModalClose}
          aria-labelledby="signup-modal"
          aria-describedby="signup-modal-for-inta-clone"
        >
          {signUpModalBody}
        </Modal>
        <Modal
          open={openSignInModal}
          onClose={handleSignInModalClose}
          aria-labelledby="login-modal"
          aria-describedby="login-modal-for-inta-clone"
        >
          {signInModalBody}
        </Modal>
      </div>
    </div>
  );
}

export default App;
