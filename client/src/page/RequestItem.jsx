import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  EuiFieldNumber,
  EuiPageTemplate,
  EuiIcon,
  EuiDatePicker,
  EuiEmptyPrompt,
  EuiLoadingSpinner,
} from "@elastic/eui";

import { requestItem } from "../redux/ItemSlice";
import moment from "moment";
import Loading from "../component/Loading";
import "../sass/requestItem.scss";
import { useLocation } from "react-router-dom";

const RequestItem = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const [startDate, setStartDate] = useState(moment());
  const [form, setForm] = useState({
    Purpose: "",
    RequiredUnit: "1",
  });
  const [stockerror, setStockError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const presentDate = new Date();
  let stockerrormsg;



  if(stockerror){
    stockerrormsg = ["Not enough unit in stock"]
  }
console.log(state)
  const handleChange = (date) => {
    setStartDate(date);
  };

  const customButtons = [
    <EuiButton onClick={() => navigate(-1)} color="primary" size="m" fill>
      Go back
    </EuiButton>,
   
  ];

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
    setStockError(false)
   
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (startDate?._i === "undefined" || !startDate?._i) {
      return alert("Delivery date cant be set to today");
    }

    if (startDate?._d < presentDate) {
      return alert("Past date cant be selected");
    }
    if(form.RequiredUnit > state.available ){
      setStockError(true)
      return
    }

    const submissionInfo = {
      itemName: id,
      Department: state.decodedUser.department,
      Requester: state.decodedUser.firstName + " " + state.decodedUser.lastName,
      RequestedItem: state.item[0]?.name,
      DeliveryDate: startDate._i,
      Purpose: form.Purpose,
      RequiredUnit: form.RequiredUnit,
      image:state.item[0]?.image.url
    };
    setSubmitting(true);
    await dispatch(requestItem(submissionInfo));
    setSubmitting(false);
    navigate(-1)
    try {
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <EuiPageTemplate restrictWidth={"75%"} grow={true}>
      {submitting && <Loading msg="Please wait while submitting..." />}
      <EuiPageTemplate.Header
        iconType="listAdd"
        pageTitle="Requisition Form"
        rightSideItems={customButtons}
        bottomBorder="extended" //if sidebar exists, bottomborder should be true
      ></EuiPageTemplate.Header>
      <EuiPageTemplate.Section
        color="plain"
        bottomBorder="extended"
        grow={true}
      >
        <>
          <EuiForm
            fullWidth
            component="form"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <EuiFlexGroup style={{ maxWidth: 600 }} direction="column">
              <EuiFlexItem>
                <EuiFormRow label="Department">
                  <EuiFieldText
                    disabled
                    name="Department"
                    value={`${state.decodedUser.department}`}
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow label="Request Item">
                  <EuiFieldText
                    disabled
                    name="RequestItem"
                    value={`${state.item[0]?.name}`}
                  />
                </EuiFormRow>
              </EuiFlexItem>

              <EuiFlexItem>
                <EuiFormRow label="Delivery Date [YYYY-MM-DD]">
                  <EuiDatePicker
                    showTimeSelect
                    selected={startDate}
                    onChange={handleChange}
                    dateFormat="YYYY-MM-DD"
                  />
                </EuiFormRow>
              </EuiFlexItem>
              <EuiFlexItem>
                <EuiFormRow isInvalid={stockerror} error={stockerrormsg} label="Required Unit">
                  <EuiFieldNumber
                    onChange={(e) => handleFormFieldChange("RequiredUnit", e)}
                    min={1}
                    max={10}
                    value={form.RequiredUnit}
                    required
                  />
                </EuiFormRow>
              </EuiFlexItem>

              <EuiFlexItem>
                <EuiFormRow label="Purpose of Requisition ">
                  <EuiFieldText
                    name="Purpose"
                    value={form.Purpose}
                    onChange={(e) => handleFormFieldChange("Purpose", e)}
                    required
                  />
                </EuiFormRow>
              </EuiFlexItem>

              <EuiSpacer />
            </EuiFlexGroup>
            <EuiButton type="submit">Submit</EuiButton>
          </EuiForm>
        </>
      </EuiPageTemplate.Section>

      <EuiPageTemplate.BottomBar
        position="static"
        paddingSize="xl"
        style={{ background: "#2b2d40" }}
      >
        <EuiText className="footer-text" textAlign="center">
          &copy; DESIGNED BY SUBHAM SHRESTHA
        </EuiText>
      </EuiPageTemplate.BottomBar>
    </EuiPageTemplate>
  );
};

export default RequestItem;
