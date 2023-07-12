import React from "react";
import { Ourlet } from "react-router-dom";
import { EuiFlexGroup, EuiFlexItem, EuiText, EuiIcon } from "@elastic/eui";
import "../sass/footer.scss";
const Footer = () => {
  return (
    <>
      <EuiFlexGroup justifyContent="center">
        <EuiFlexItem className="footer-container" grow={false}>
          <EuiFlexGroup alignItems="center">
            <EuiFlexItem>
              <EuiText
                className="footer-text"
                textAlign="center"
                color="#ffffff"
              >
                	&copy; DESIGNED BY SUBHAM SHRESTHA
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};

export default Footer;
