import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import Chip from "@mui/material/Chip";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import TurnedInNotOutlinedIcon from "@mui/icons-material/TurnedInNotOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { getUserProfileData } from "../../store/actions";
import TutorialLikesDislikes from "../ui-helpers/TutorialLikesDislikes";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(1),
    borderRadius: theme.spacing(2),
    boxSizing: "border-box",
    [theme.breakpoints.down("md")]: {
      width: "auto"
    },
    [theme.breakpoints.down("xs")]: {
      width: "auto"
    },
    boxShadow: theme.shadows[1],
    transition: "box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out",
    "&:hover": {
      boxShadow: theme.shadows[8],
      transform: "translateY(-7px)"
    }
  },
  grow: {
    flexGrow: 1
  },
  margin: {
    marginRight: "5px"
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  inline: {
    fontWeight: 600
  },
  contentPadding: {
    padding: "0 16px"
  },
  icon: {
    padding: "5px"
  },
  time: {
    lineHeight: "1"
  },
  small: {
    padding: "4px"
  },
  settings: {
    flexWrap: "wrap"
  },
  toggleButton: {
    marginRight: theme.spacing(1),
    "&:hover": {
      transform: "scale(1.1)"
    },
    transition: "transform 0.2s ease-in-out"
  }
}));

export default function CardWithoutPicture({ tutorial }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const firebase = useFirebase();
  const firestore = useFirestore();

  useEffect(() => {
    getUserProfileData(tutorial?.created_by)(firebase, firestore, dispatch);
  }, [tutorial]);

  const user = useSelector(
    ({
      profile: {
        user: { data }
      }
    }) => data
  );

  const getTime = timestamp => {
    return timestamp.toDate().toDateString();
  };

  return (
    <Card className={classes.root} data-testId="codelabz">
      <CardHeader
        avatar={
          <Avatar className={classes.avatar}>
            {user?.photoURL && user?.photoURL.length > 0 ? (
              <img src={user?.photoURL} alt="User Avatar" />
            ) : (
              user?.displayName[0]
            )}
          </Avatar>
        }
        title={
          <React.Fragment>
            <Typography
              component="span"
              variant="h6"
              className={classes.inline}
              color="textPrimary"
              data-testId="UserName"
            >
              {user?.displayName}
            </Typography>
            {tutorial?.owner && (
              <>
                {" for "}
                <Typography
                  component="span"
                  variant="h6"
                  className={classes.inline}
                  color="textPrimary"
                  data-testId="UserOrgName"
                >
                  {tutorial?.owner}
                </Typography>
              </>
            )}
          </React.Fragment>
        }
        subheader={tutorial?.createdAt ? getTime(tutorial?.createdAt) : ""}
      />
      <Link to={`/tutorial/${tutorial?.tutorial_id}`}>
        <CardContent
          className={classes.contentPadding}
          data-testId="codelabzDetails"
        >
          <Typography variant="h5" color="text.primary" data-testId="Title">
            {tutorial?.title}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            component="p"
            paragraph
            data-testId="Description"
          >
            {tutorial?.summary}
          </Typography>
        </CardContent>
      </Link>
      <CardActions className={classes.settings} disableSpacing>
        <Chip
          label="HTML"
          component="a"
          href="#chip"
          clickable
          variant="outlined"
          className={classes.margin}
        />
        <Typography
          variant="overline"
          display="block"
          className={classes.time}
          data-testId="Time"
        >
          {"10 min"}
        </Typography>
        <div className={classes.grow} />
        <TutorialLikesDislikes tutorial_id={tutorial?.tutorial_id} />
        <IconButton aria-label="share" data-testId="CommentIcon">
          <ChatOutlinedIcon />
        </IconButton>
        <IconButton aria-label="add to favorites" data-testId="ShareIcon">
          <ShareOutlinedIcon />
        </IconButton>
        <IconButton aria-label="share" data-testId="NotifIcon">
          <TurnedInNotOutlinedIcon />
        </IconButton>
        <IconButton aria-label="share" data-testId="MoreIcon">
          <MoreVertOutlinedIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
