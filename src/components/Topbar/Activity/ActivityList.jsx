import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Stack } from "@mui/system";

const useStyles = makeStyles(theme => ({
  root: {},
  defaultButton: {
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    textDecoration: "none",
    textTransform: "none",
    margin: `${theme.spacing(0)}px ${theme.spacing(1)}px ${theme.spacing(
      0
    )}px ${theme.spacing(0)}px`,
    border: "none",
    boxShadow: theme.shadows[2],
    transition: theme.transitions.create(
      ["box-shadow", "transform", "background-color"],
      {
        duration: theme.transitions.duration.short
      }
    ),
    "&:hover": {
      transform: "translateY(-2px) translateX(2px)",
      backgroundColor: theme.palette.action.hover,
      boxShadow: theme.shadows[4],
      border: "none"
    }
  },

  activeButton: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.main
    }
  },
  inactiveButton: {
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,
    "&:hover": {
      backgroundColor: theme.palette.action.hover
    }
  },

  buttonIcon: {
    marginRight: theme.spacing(1)
  },

  buttonText: {
    fontWeight: theme.typography.fontWeightMedium
  }
}));

function ActivityList({ value, toggle, acitvitylist, classname }) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Grid container spacing={2} className={classname}>
        <Grid item xs={12}>
          <Stack spacing={2} direction={"row"}>
            {acitvitylist.map((item, index) => (
              <Button
                variant="outlined"
                color="primary"
                key={index}
                className={`
                    ${classes.defaultButton}
                    ${
                      value === item.id
                        ? classes.activeButton
                        : classes.inactiveButton
                    }
                `}
                disableRipple
                disableElevation
                onClick={() => toggle(item)}
              >
                {item.icon && (
                  <item.icon fontSize="small" className={classes.buttonIcon} />
                )}
                <Typography variant="body1" className={classes.buttonText}>
                  {item.text}
                </Typography>
              </Button>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default ActivityList;
