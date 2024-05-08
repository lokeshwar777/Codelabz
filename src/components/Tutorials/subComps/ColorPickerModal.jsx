import React, { useState } from "react";
import { ChromePicker } from "react-color";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useDispatch } from "react-redux";
import { setTutorialTheme } from "../../../store/actions";

const ColorPickerModal = ({ visible, visibleCallback, tutorial_id, owner }) => {
  const [bgColor, setBgColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [loading, setLoading] = useState(false);
  const firebase = useFirebase();
  const firestore = useFirestore();
  const dispatch = useDispatch();

  const handleOk = () => {
    setLoading(true);
    setTutorialTheme({ tutorial_id, owner, bgColor, textColor })(
      firebase,
      firestore,
      dispatch
    ).then(() => {
      setLoading(false);
      visibleCallback(false);
    });
  };

  const handleCancel = () => {
    visibleCallback(false);
  };

  const updateTextColor = color => {
    setTextColor(color.hex);
  };

  const updateBackgroundColor = color => {
    setBgColor(color.hex);
  };

  return (
    <div>
      <Modal
        open={visible}
        onClose={handleCancel}
        onOk={handleOk}
        confirmLoading={loading}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Grid>
          <Grid align="middle" justify="center" className="mb-24">
            <Grid
              xs={24}
              md={12}
              className="mb-16"
              style={{ textAlign: "center" }}
            >
              <h4 className="mb-8">Text Color</h4>
              <div>
                <ChromePicker
                  disableAlpha={true}
                  color={textColor}
                  onChange={updateTextColor}
                />
              </div>
            </Grid>
            <Grid
              xs={24}
              md={12}
              className="mb-16"
              style={{ textAlign: "center" }}
            >
              <h4 className="mb-8">Background Color</h4>
              <div>
                <ChromePicker
                  disableAlpha={true}
                  color={bgColor}
                  onChange={updateBackgroundColor}
                />
              </div>
            </Grid>
          </Grid>

          <Grid
            style={{
              width: "100%",
              height: "50px",
              backgroundColor: bgColor,
              color: textColor,
              border: "1px solid #eeeeee"
            }}
            align="middle"
          >
            <Grid xs={24} style={{ textAlign: "center" }}>
              Change the values above to see the preview
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </div>
  );
};

export default ColorPickerModal;
