import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import { red } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ChatBubbleOutlineOutlinedIcon from "@material-ui/icons/ChatBubbleOutlineOutlined";
import FavoriteIconOutlined from "@material-ui/icons/FavoriteOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ShareIcon from "@material-ui/icons/Share";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 560,
    marginBottom: 45,
    backgroundColor: "#FFFFF",
    border: "1px lightgray solid",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

function Post(props) {
  const classes = useStyles();
  return (
    <Card key={props.post.id} className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" alt={props.post.username} className={classes.avatar}>
            {props.post.username.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.post.username}
        subheader={props.post.pusblishedOn}
      />
      {props.post.mime.includes("image") ? (
        <CardMedia
          component="img"
          image={props.post.postMediaUrl}
          title={props.post.caption}
        />
      ) : (
        <CardMedia
          src={props.post.postMediaUrl}
          title={props.post.caption}
          component="video"
          controls
        />
      )}

      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.post.caption}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="Like">
          <FavoriteIconOutlined />
        </IconButton>
        <IconButton aria-label="Share">
          <ChatBubbleOutlineOutlinedIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default Post;
