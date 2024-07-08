import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import React from "react";
import { makeStyles } from "@mui/styles";
import UserElement from "./UserElement";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5)
    },
    flex: 1,
    marginBottom: "2rem",
    width: "100%"
  },
  userImg: {
    width: "2rem",
    height: "2rem",
    borderRadius: "50%",
    marginRight: "10px"
  },

  card: {
    display: "flex",
    minWidth: "100%",
    width: "100%",
    borderRadius: "16px",
    transition: theme.transitions.create(["box-shadow", "transform"], {
      duration: theme.transitions.duration.short
    }),
    "&:hover": {
      boxShadow: "-4px 4px 15px 0px black",
      transform: "scale(1.02)"
    }
  },

  cardContent: {
    width: "100%"
  }
}));

const UserCard = props => {
  const classes = useStyles();
  return (
    <div className={classes.root} data-testId="UsersCard">
      <Card sx={{ minWidth: 275 }} className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            data-testId="UsersCardTitle"
          >
            {props.title}
          </Typography>
          {props.users.map(function (user, index) {
            return (
              <UserElement
                key={index}
                user={user}
                index={index}
                useStyles={useStyles}
              />
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserCard;
