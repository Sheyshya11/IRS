import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createItem, setLoading } from "../redux/ItemSlice";
import { useNavigate } from "react-router-dom";
import StockPage from "../component/StockPage";
import "../sass/createItem.scss";

import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiText,
  EuiImage,
  EuiFieldText,
  EuiForm,
  EuiSpacer,
  EuiFormRow,
  EuiButton,
  EuiPageTemplate,
  EuiFieldNumber,
  EuiSelect,
  EuiFilePicker,
  EuiTextArea,
  EuiIcon,
  EuiHorizontalRule,
  EuiEmptyPrompt,
} from "@elastic/eui";
import jwt_decode from "jwt-decode";
import Cookie from "js-cookie";
import { useGeneratedHtmlId } from "@elastic/eui";
import Loading from "../component/Loading";

const CreateNewItem = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fileImg, setFileImg] = useState([{}]);
  const [view, setView] = useState(false);
  const { loading } = useSelector((state) => state.item);

  const [stock, setStock] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [allItems, setItem] = useState([]);
  const [base64Image, setBase64Image] = useState("");
  const filePickerRef = useRef();
  const removeFilePickerId = useGeneratedHtmlId({ prefix: "removeFilePicker" });
  const [serialNumbers, setSerialNumbers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    quality: "High",
    image: "",
    description: "",
  });

  useEffect(() => {
    setBase64Image("");
  }, [fileImg]);

  // select image
  const onChange = (files) => {
    const file = files[0];
    setFileImg(files.length > 0 ? files : {});
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
      setBase64Image(compressedDataUrl);
      setForm({ ...form, image: compressedDataUrl });
      getImageSize(compressedDataUrl);
    };
  };

  const getImageSize = (image) => {
    var stringLength = image.length - "data:image/png;base64,".length;

    var sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    var sizeInKb = sizeInBytes / 1000;
  };

  const handleStock = () => {
    if (quantity > 0) {
      setStock(true);
      setItem([]);
    }
  };

  useEffect(() => {
    const token = Cookie.get("token");
    const name = jwt_decode(token);
    setEmail(name.email);
  }, []);

  //on  change
  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { name, image, quality, description } = form;
      const newItems = serialNumbers.map((item) => {
        return {
          name,
          image,
          quantity,
          quality,
          description,
          ssid: item,
        };
      });

      dispatch(setLoading(true));
      if (serialNumbers?.length) {
        const response = await dispatch(createItem({ items: newItems }));
        console.log(response);
        dispatch(setLoading(false));
        navigate("/dash");
      } else {
        dispatch(setLoading(false));
        alert("Input SSID");
      }
    } catch (error) {
      console.log({ error });
    }
  };
  console.log(allItems);

  // custom button
  const customButtons = [
    <EuiButton onClick={() => navigate(-1)} color="primary" size="m" fill>
      Go back
    </EuiButton>,
  ];

  console.log(serialNumbers);
  //options
  const options = [
    { value: "High", text: "High" },
    { value: "Medium", text: "Medium" },
    { value: "Low", text: "Low" },
  ];

  const basicSelectId = useGeneratedHtmlId({ prefix: "basicSelect" });

  return (
    <>
      {loading && <Loading />}

      <EuiPageTemplate restrictWidth={"75%"} grow={true}>
        <EuiPageTemplate.Header
          iconType="listAdd"
          pageTitle="Items Registration Form"
          rightSideItems={customButtons}
          bottomBorder="extended" //if sidebar exists, bottomborder should be true
        >
          <EuiText
            style={{
              fontFamily: "Roboto",
            }}
            color="danger"
          >
            <EuiIcon type="lock" style={{ marginRight: "10px" }} />
            Admin Priviledge Only.
          </EuiText>

          <EuiText>
            <EuiIcon type="warning" style={{ marginRight: "10px" }} />
            Entry items needs to be available at the organization inventory and
            usable form.
          </EuiText>
        </EuiPageTemplate.Header>
        <EuiPageTemplate.Section
          color="plain"
          bottomBorder="extended"
          grow={true}
        >
          <EuiForm
            className="container"
            component="form"
            autoComplete="off"
            onSubmit={handleSubmit}
          >
            <EuiFlexGroup style={{ maxWidth: 600 }} direction="column">
              <EuiFlexItem>
                <EuiFormRow label="Item name">
                  <EuiFieldText
                    placeholder="Item"
                    name="name"
                    value={form.password}
                    onChange={(e) => handleFormFieldChange("name", e)}
                    required
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label="Description">
                  <EuiTextArea
                    placeholder="Description"
                    aria-label="Use aria labels when no actual label is in use"
                    value={form.description}
                    onChange={(e) => handleFormFieldChange("description", e)}
                  />
                </EuiFormRow>
              </EuiFlexItem>

              <EuiFlexItem>
                <EuiFormRow label="Quality">
                  <EuiSelect
                    id={basicSelectId}
                    options={options}
                    value={form.quality}
                    onChange={(e) => handleFormFieldChange("quality", e)}
                    aria-label="Use aria labels when no actual label is in use"
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label="Supplier">
                  <EuiFieldText
                    name="supplier"
                    value="Vairav Technology"
                    disabled
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

              <EuiFlexItem>
                <EuiFormRow label="Quantity">
                  <EuiFieldNumber
                    placeholder="Quantity"
                    name="quantity"
                    max={20}
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    append={
                      <>
                        <EuiButton color="primary" onClick={handleStock}>
                          Set
                        </EuiButton>
                      </>
                    }
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                {base64Image.length > 0 && (
                  <EuiButton
                    style={{
                      width: "90px",
                      height: "34px",
                      borderRadius: "4px",
                    }}
                    onClick={() => setView(!view)}
                  >
                    View Image
                  </EuiButton>
                )}

                {view && fileImg.length > 0 && base64Image && (
                  <img className="viewImage" src={base64Image} alt="Uploaded" />
                )}
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow>
                  <EuiButton color="primary" fill size="s" type="submit">
                    Submit
                  </EuiButton>
                </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiForm>
          {stock && (
            <StockPage
              handleCancel={setStock}
              count={quantity}
              setSerialNumbers={setSerialNumbers}
              serialNumbers={serialNumbers}
            />
          )}
        </EuiPageTemplate.Section>

        <EuiPageTemplate.BottomBar
          position="static"
          paddingSize="xl"
          style={{ background: "#2b2d40" }}
        >
          <EuiText
            style={{ fontWeight: "700" }}
            className="footer-text"
            textAlign="center"
          >
            &copy; DESIGNED BY SUBHAM SHRESTHA
          </EuiText>
        </EuiPageTemplate.BottomBar>
      </EuiPageTemplate>
    </>
  );
};

export default CreateNewItem;
