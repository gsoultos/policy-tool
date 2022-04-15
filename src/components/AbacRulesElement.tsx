import {Button, Divider, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import React from "react";
import AbacTargetElement from "./AbacTargetElement";
import {DataGrid, GridCallbackDetails, GridSelectionModel} from "@mui/x-data-grid";

class AbacRulesElement extends React.Component<any, any> {
    private readonly onRulesChange: Function;

    constructor(props: any) {
        super(props);
        this.state = {
            description: "",
            ruleId: "",
            effect: "",
            subjectAttribute: "",
            resourceAttribute: "",
            actionAttribute: "",
            rules: new Map()
        }

        this.onRulesChange = this.props.onRulesChange.bind(this);
    }

    private onSubjectSelectedAttributeChange = (selectedAttribute: string) => {
        this.setState({subjectAttribute: selectedAttribute});
    }

    private onResourceSelectedAttributeChange = (selectedAttribute: string) => {
        this.setState({resourceAttribute: selectedAttribute});
    }

    private onActionSelectedAttributeChange = (selectedAttribute: string) => {
        this.setState({actionAttribute: selectedAttribute});
    }

    private onDescriptionChangeListener = (event: any) => {
        this.setState({description: event.target.value});
    }

    private onRuleIdChangeListener = (event: any) => {
        this.setState({ruleId: event.target.value});
    }

    private onEffectChangeListener = (event: any) => {
        this.setState({effect: event.target.value});
    }

    private deleteRule = () => {
        const rules = new Map(this.state.rules)
        rules.delete(this.state.ruleId);
        this.setState({
            rules: rules,
            description: "",
            ruleId: "",
            effect: "",
            subjectAttribute: "",
            resourceAttribute: "",
            actionAttribute: ""
        })

        this.onRulesChange(rules);
    }

    componentDidMount() {
        this.props.rules.forEach((rule: any) => {
            this.setState((state: any) => ({
                rules: state.rules.set(rule.ruleId, rule)
            }))
        })
    }

    private onRuleSelectListener = (selectionModel: GridSelectionModel, details: GridCallbackDetails) => {
        this.setState((state: any) => ({
            description: state.rules.get(selectionModel[0])?.description,
            ruleId: state.rules.get(selectionModel[0])?.ruleId,
            effect: state.rules.get(selectionModel[0])?.effect,
            subjectAttribute: state.rules.get(selectionModel[0])?.subjectAttribute,
            resourceAttribute: state.rules.get(selectionModel[0])?.resourceAttribute,
            actionAttribute: state.rules.get(selectionModel[0])?.actionAttribute
        }))
    }

    private addRule = () => {
        const rule = {
            id: this.state.ruleId,
            description: this.state.description,
            ruleId: this.state.ruleId,
            effect: this.state.effect,
            subjectAttribute: this.state.subjectAttribute,
            resourceAttribute: this.state.resourceAttribute,
            actionAttribute: this.state.actionAttribute
        }

        this.setState((state: any) => ({
            rules: state.rules.set(rule.id, rule),
            description: "",
            ruleId: "",
            effect: "",
            subjectAttribute: "",
            resourceAttribute: "",
            actionAttribute: ""
        }));

        this.onRulesChange(this.state.rules);
    }

    render() {
        return (
            <div>
                <DataGrid
                    autoHeight={true}
                    hideFooter
                    columns={[
                        {field: 'description', headerName: 'Description', flex: 1},
                        {field: 'ruleId', headerName: 'Rule ID', flex: 1},
                        {field: 'effect', headerName: 'Effect', flex: 1}
                    ]}
                    rows={Array.from(this.state.rules.values()) as any[]}
                    onSelectionModelChange={this.onRuleSelectListener}
                />

                <Divider sx={{mt: 1, mb: 1}}/>

                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Description"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={this.onDescriptionChangeListener}
                    value={this.state.description}
                />
                <TextField
                    margin="dense"
                    id="name"
                    label="Rule ID"
                    type="text"
                    fullWidth
                    variant="standard"
                    onChange={this.onRuleIdChangeListener}
                    value={this.state.ruleId}
                />

                <FormControl fullWidth sx={{mt: 1, mb: 1}}>
                    <InputLabel>Effect</InputLabel>
                    <Select label="Effect" onChange={this.onEffectChangeListener} value={this.state.effect}>
                        <MenuItem value={"PERMIT"}>PERMIT</MenuItem>
                        <MenuItem value={"DENY"}>DENY</MenuItem>
                    </Select>
                </FormControl>

                <AbacTargetElement subjectAttributes={this.props.subjectAttributes}
                                   resourceAttributes={this.props.resourceAttributes}
                                   actionAttributes={this.props.actionAttributes}
                                   onSubjectSelectedAttributeChange={this.onSubjectSelectedAttributeChange}
                                   onResourceSelectedAttributeChange={this.onResourceSelectedAttributeChange}
                                   onActionSelectedAttributeChange={this.onActionSelectedAttributeChange}
                                   selectedSubjectAttribute={this.state.subjectAttribute}
                                   selectedResourceAttribute={this.state.resourceAttribute}
                                   selectedActionAttribute={this.state.actionAttribute}
                />

                <Button sx={{mt: 1}} color="success" variant="contained" fullWidth onClick={this.addRule}>{
                    this.state.rules.get(this.state.ruleId) ? "Edit Rule" : "Add Rule"
                }</Button>
                <Button sx={{mt: 1, display: this.state.rules.get(this.state.ruleId) ? "" : "none"}} variant="contained"
                        color="error" fullWidth onClick={this.deleteRule}>Delete Rule</Button>
            </div>
        );
    }

}

export default AbacRulesElement;