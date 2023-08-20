import React from "react";
import { useNavigate } from "react-router-dom";
import { EuiEmptyPrompt, EuiButton, EuiButtonEmpty } from "@elastic/eui";

export default () => {
  const navigate = useNavigate();
  return (
    <EuiEmptyPrompt
      style={{
        height: "100vh",
        display: "flex",
      }}
      color="subdued"
      title={<h2>Page not found</h2>}
      layout="vertical"
      body={
        <p>
          We can&apos;t find the page you&apos;re looking for. It might have
          been removed, renamed, or it didn&apos;t exist in the first place.
        </p>
      }
      actions={[
        <EuiButton onClick={() => navigate("/")} color="primary" fill>
          Home
        </EuiButton>,
        <EuiButtonEmpty
          onClick={() => navigate(-1)}
          iconType="arrowLeft"
          flush="both"
        >
          Go back
        </EuiButtonEmpty>,
      ]}
    />
  );
};
