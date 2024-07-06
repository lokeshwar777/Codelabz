import { Grid, Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React from "react";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";

const useStyles = makeStyles(theme => ({
  root: {
    height: theme.spacing(8),
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    cursor: "pointer",
    margin: theme.spacing(1),
    padding: theme.spacing(1.5),
    borderRadius: "16px",
    boxShadow: theme.shadows[1],
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create(["box-shadow", "transform"], {
      duration: theme.transitions.duration.short
    }),
    "&:hover": {
      boxShadow: theme.shadows[4],
      transform: "translateY(-2px)"
    }
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  iconDiv: {
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.short
    }),
    "&:hover": {
      transform: "scale(1.3)" // Enlarge the icon on hover
    }
  },
  title: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.spacing(2.5),
    lineHeight: 1.2
  },
  description: {
    fontSize: theme.spacing(2),
    color: theme.palette.text.secondary
  }
}));

function NewCodelabz({ setVisibleModal }) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Paper className={classes.root} data-testId="homepageNewCodelabz">
        <Grid
          spacing={0}
          justifyContent="flex-start"
          alignItems="center"
          className={classes.flex}
        >
          <Grid
            item
            className={classes.iconDiv}
            justifyContent="center"
            alignContent="center"
            data-testId="NewCodelabzBtn"
            onClick={() => setVisibleModal(true)}
          >
            <AddBoxRoundedIcon color="primary" fontSize="large" />
          </Grid>
          <Grid item container sm={9} direction="column">
            <Typography variant="h7" className={classes.title}>
              New Codelabz
            </Typography>
            <Typography variant="body3" className={classes.description}>
              Share a tutorial
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </React.Fragment>
  );
}

export default NewCodelabz;
