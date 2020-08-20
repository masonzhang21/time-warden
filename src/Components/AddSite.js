import React, { Component } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import * as storage from "../Utils/storage";
import * as functions from "../Utils/functions";

/**
 * Form to add a site to a bucket
 */
export class AddSite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validated: false,
      siteAlreadyInBucketError: false,
      addSiteInput: "",
    };
  }
  /**
   * Validates and adds a site to the bucket
   * @param {*} e
   */
  addSite = async (event) => {
    event.preventDefault();
    this.setState({ validated: true });
    if (!event.currentTarget.checkValidity()) return;
    const watchedSites = await storage.getSites();
    const potentialSite = functions.getSiteName(
      "https://" + this.state.addSiteInput
    );

    if (!(potentialSite in watchedSites)) {
      this.props.addToBucket(potentialSite);
      storage.save("sites", {
        ...watchedSites,
        [potentialSite]: this.props.bucketID,
      });
      this.setState({ addSiteInput: "", validated: false });
    } else {
      this.setState({ siteAlreadyInBucketError: true });
    }
  };

  //not a very good regex, but it mostly does the job!
  URLPattern = "^[^\\s\\/$.?#]+\\.[a-z]{2,}$";

  render() {
    return (
      <Form
        noValidate
        validated={this.state.validated}
        onSubmit={this.addSite}
        style={{
          display: "flex",
          marginBottom: 0,
          marginTop: "30px",
          justifyContent: "space-between",
        }}
      >
        <Form.Group style={{ margin: 0 }}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="inputGroupPrepend">https://</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              type="text"
              placeholder="google.com"
              pattern={this.URLPattern}
              required
              value={this.state.addSiteInput}
              onChange={(e) => {
                this.setState({
                  addSiteInput: e.target.value,
                  siteAlreadyInBucketError: false,
                  validated: false,
                });
              }}
            />
            <Button className="ml-2" type="submit" variant="outline-info">
              Add Site
            </Button>
            <Form.Control.Feedback type="invalid">
              Please enter a URL.
            </Form.Control.Feedback>
            <Form.Control.Feedback type="valid">
              {this.state.siteAlreadyInBucketError &&
                "Site is already in a bucket"}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Form>
    );
  }
}

export default AddSite;
