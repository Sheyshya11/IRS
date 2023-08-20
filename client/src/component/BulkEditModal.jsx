import {
  EuiButton,
  EuiEmptyPrompt,
  EuiFieldText,
  EuiFilePicker,
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiFormRow,
  EuiTextArea,
  useGeneratedHtmlId,
} from "@elastic/eui";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { editinBulk } from "../redux/ItemSlice";
import "../sass/editBulkItem.scss";
import { useNavigate } from "react-router-dom";

const BulkEditModal = (props) => {
  const filePickerRef = useRef();
  const removeFilePickerId = useGeneratedHtmlId({ prefix: "removeFilePicker" });
  const [editBulkForm, setEditBulkForm] = useState(props.editBulkForm);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChange = (files) => {
    const file = files[0];

    const img = new Image();

    // Load the image file
    const reader = new FileReader();
    if (file && file.type.match("image.*")) {
      reader.readAsDataURL(file);
    }
    reader.onload = (e) => {
      img.src = e.target.result;
    };

    // Perform image compression
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 800; // Maximum width for the compressed image
      const MAX_HEIGHT = 600; // Maximum height for the compressed image
      let width = img.width;
      let height = img.height;

      // Calculate the new dimensions
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      // Set the canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Compress the image on the canvas
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      // Get the compressed data URL
      const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7); // Specify the desired image quality (0.0 - 1.0)

      // Update the state with the compressed image data URL

      setEditBulkForm({
        ...editBulkForm,
        image: compressedDataUrl,
      });
    };
  };

  const handleEditChange = (field, e) => {
    setEditBulkForm({ ...editBulkForm, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    props.setEditBulkModal(false);
    try {
      props.setLoading(true);
      const response = await dispatch(editinBulk(editBulkForm)).unwrap();

      if (response) {
        navigate("/dash");
      }
      props.setLoading(false);
    } catch (error) {
      props.setLoading(false);
      props.notify(error);
    }
  };

  return (
    <div className="editBulkPage">
      <EuiEmptyPrompt
        layout="horizontal"
        color="plain"
        title={<h2 style={{ textAlign: "center" }}>Edit </h2>}
        actions={
          <>
            <EuiForm
              component="form"
              className="containerForm"
              onSubmit={handleSubmit}
            >
              <EuiFlexGroup direction="column" className="containerForm">
                <EuiFlexItem>
                  <EuiFormRow label="Name">
                    <EuiFieldText
                      value={editBulkForm.name}
                      placeholder="Name"
                      onChange={(e) => handleEditChange("name", e)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>

                <EuiFlexItem>
                  <EuiFormRow label="Supplier">
                    <EuiFieldText
                      value={editBulkForm.supplier}
                      placeholder="Supplier"
                      onChange={(e) => handleEditChange("supplier", e)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label="Description">
                    <EuiTextArea
                      value={editBulkForm.description}
                      placeholder="Description"
                      aria-label="Use aria labels when no actual label is in use"
                      onChange={(e) => handleEditChange("description", e)}
                    />
                  </EuiFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiFormRow label="Image">
                    <EuiFilePicker
                      compressed
                      ref={filePickerRef}
                      id={removeFilePickerId}
                      accept="image/*"
                      multiple
                      initialPromptText="Select or drag and drop multiple files"
                      onChange={onChange}
                      display="default"
                      aria-label="Use aria labels when no actual label is in use"
                      required
                    />
                  </EuiFormRow>
                </EuiFlexItem>

                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiButton type="submit" color="primary" fill>
                      Submit
                    </EuiButton>
                  </EuiFlexItem>

                  <EuiFlexItem>
                    <EuiButton
                      color="danger"
                      fill
                      onClick={() => {
                        props.setEditBulkModal(false);
                      }}
                    >
                      Cancel
                    </EuiButton>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlexGroup>
            </EuiForm>
          </>
        }
      />
    </div>
  );
};

export default BulkEditModal;
