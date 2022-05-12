import React from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {Attribute} from "../api/model/attribute";

class AbacTargetElement extends React.Component<any, any> {
    private readonly onSubjectSelectedAttributeChange: Function;
    private readonly onResourceSelectedAttributeChange: Function;
    private readonly onActionSelectedAttributeChange: Function;
    private readonly onEnvironmentSelectedAttributeChange: Function;

    constructor(props: any) {
        super(props);
        this.onSubjectSelectedAttributeChange = this.props.onSubjectSelectedAttributeChange.bind(this);
        this.onResourceSelectedAttributeChange = this.props.onResourceSelectedAttributeChange.bind(this);
        this.onActionSelectedAttributeChange = this.props.onActionSelectedAttributeChange.bind(this);
        this.onEnvironmentSelectedAttributeChange = this.props.onEnvironmentSelectedAttributeChange.bind(this);
    }

    private selectSubject = (event: any) => {
        this.onSubjectSelectedAttributeChange(event.target.value);
    }

    private selectResource = (event: any) => {
        this.onResourceSelectedAttributeChange(event.target.value);
    }

    private selectAction = (event: any) => {
        this.onActionSelectedAttributeChange(event.target.value);
    }

    private selectEnvironment = (event: any) => {
        this.onEnvironmentSelectedAttributeChange(event.target.value);
    }

    render() {
        return (
            <div style={{display: "flex"}}>
                <div style={{width: "100%", marginRight: 8}}>
                    <FormControl fullWidth sx={{mt: 1, mb: 1}}>
                        <InputLabel>Subject</InputLabel>
                        <Select label="Subject" onChange={this.selectSubject}
                                value={this.props.selectedSubjectAttribute}>
                            {
                                this.props.subjectAttributes.map((attribute: any) => (
                                    (attribute[1] as Attribute).attributeValues[0].content.map((attributeValue: string) => (
                                        <MenuItem
                                            value={`${attributeValue}/${attribute[0]}`}>{attributeValue}</MenuItem>
                                    ))
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>

                <div style={{width: "100%", marginRight: 8}}>
                    <FormControl fullWidth sx={{mt: 1, mb: 1}}>
                        <InputLabel>Resource</InputLabel>
                        <Select label="Resource" onChange={this.selectResource}
                                value={this.props.selectedResourceAttribute}>
                            {
                                this.props.resourceAttributes.map((attribute: any) => (
                                    (attribute[1] as Attribute).attributeValues[0].content.map((attributeValue: string) => (
                                        <MenuItem
                                            value={`${attributeValue}/${attribute[0]}`}>{attributeValue}</MenuItem>
                                    ))
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>

                <div style={{width: "100%"}}>
                    <FormControl fullWidth sx={{mt: 1, mb: 1}}>
                        <InputLabel>Action</InputLabel>
                        <Select label="Action" onChange={this.selectAction} value={this.props.selectedActionAttribute}>
                            {
                                this.props.actionAttributes.map((attribute: any) => (
                                    (attribute[1] as Attribute).attributeValues[0].content.map((attributeValue: string) => (
                                        <MenuItem
                                            value={`${attributeValue}/${attribute[0]}`}>{attributeValue}</MenuItem>
                                    ))
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>

                <div style={{width: "100%"}}>
                    <FormControl fullWidth sx={{mt: 1, mb: 1}}>
                        <InputLabel>Environment</InputLabel>
                        <Select label="Environment" onChange={this.selectEnvironment} value={this.props.selectedEnvironmentAttribute}>
                            {
                                this.props.environmentAttributes.map((attribute: any) => (
                                    (attribute[1] as Attribute).attributeValues[0].content.map((attributeValue: string) => (
                                        <MenuItem
                                            value={`${attributeValue}/${attribute[0]}`}>{attributeValue}</MenuItem>
                                    ))
                                ))
                            }
                        </Select>
                    </FormControl>
                </div>
            </div>
        );
    }

}

export default AbacTargetElement;