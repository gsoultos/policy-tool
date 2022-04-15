import React from "react";
import {CATEGORY_API} from "../App";
import {Attribute} from "../api/model/attribute";
import {AttributeValueType} from "../api/model/attributeValueType";
import Attributes from "../components/Attributes";
import {Alert, Snackbar} from "@mui/material";

class BaseCategory extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {attributes: [], error: false, errorMessage: ""}
    }

    private getAttributes = () => {
        CATEGORY_API.getAttributes(this.props.category).then(result => {
            this.setState({
                attributes: Object.entries(result.data)
            });
        });
    }

    componentDidMount() {
        this.getAttributes();
    }

    private static attributeBuilder(attributeId: string, issuer: string, includeInResult: boolean, attributeValues: string): Attribute {
        const attribute = new Attribute();

        attribute.attributeId = attributeId;
        attribute.issuer = issuer;
        attribute.includeInResult = includeInResult;
        if (attributeValues !== "") {
            const attributeValue = new AttributeValueType();
            attributeValue.content = attributeValues.replaceAll(/\s/g, '').split(',');
            attributeValue.dataType = "string";
            attribute.attributeValues = new Array<AttributeValueType>(attributeValue);
        }

        return attribute;
    }

    private addAttribute = (attributeId: string, issuer: string, includeInResult: boolean, attributeValues: string) => {
        CATEGORY_API.addAttribute(this.props.category, BaseCategory.attributeBuilder(attributeId, issuer, includeInResult, attributeValues)).then(() => {
            this.getAttributes();
        }).catch(() => (
            this.setState({error: true, errorMessage: "Could not create new attribute."})
        ));
    }

    private deleteAttribute = (attributeId: string) => {
        CATEGORY_API.deleteAttribute(this.props.category, attributeId).then(() => {
            this.getAttributes();
        }).catch(() => {
            this.setState({error: true, errorMessage: "Could not delete attribute."})
        })
    }

    render() {
        return (
            <div className="content">
                <Attributes attributes={this.state.attributes}
                            deleteAttribute={this.deleteAttribute}
                            addAttribute={this.addAttribute}/>
                <Snackbar
                    open={this.state.error}
                    onClose={() => this.setState({error: false, errorMessage: ""})}
                    autoHideDuration={5000}
                    anchorOrigin={{vertical: "bottom", horizontal: "right"}}>
                    <Alert onClose={() => this.setState({error: false, errorMessage: ""})} severity="error"
                           sx={{width: '100%'}}>
                        {this.state.errorMessage}
                    </Alert>
                </Snackbar>
            </div>
        );
    }
}

export default BaseCategory